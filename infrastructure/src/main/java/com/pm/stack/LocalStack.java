package com.pm.stack;

import software.amazon.awscdk.*;
import software.amazon.awscdk.services.ec2.*;
import software.amazon.awscdk.services.ecs.*;
import software.amazon.awscdk.services.ecs.Protocol;
import software.amazon.awscdk.services.logs.LogGroup;
import software.amazon.awscdk.services.logs.RetentionDays;
import software.amazon.awscdk.services.route53.CfnHealthCheck;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class LocalStack extends Stack {
    private final Vpc vpc;
    private final Cluster ecsCluster;

    public LocalStack(final App scope, final String id, final StackProps props) {
        super(scope, id, props);
        this.vpc = createVpc();

        this.ecsCluster = createEcsCluster();

        FargateService authService = createFargateService(
                "AuthService",
                "auth-service",
                List.of(4005),
                Map.of(
                        "JWT_SECRET", "87FNI484RCRNGFWIERYBF2CB3qsbnwYGsuihdwjwcnuixhg4fc2gc3kjrbHZBTWYSGgTVGFYRCFXEWFXDUT",
                        "SPRING_DATASOURCE_URL", "jdbc:postgresql://auth-service-db:5432/auth-service-db",
                        "SPRING_DATASOURCE_USERNAME", "postgres1",
                        "SPRING_DATASOURCE_PASSWORD", "postgres@1",
                        "SPRING_JPA_HIBERNATE_DDL_AUTO", "update",
                        "SPRING_SQL_INIT_MODE", "always",
                        "SPRING_DATASOURCE_HIKARI_INITIALIZATION_FAIL_TIMEOUT", "60000"
                )
        );

        FargateService billingService = createFargateService(
                "BillingService",
                "billing-service",
                List.of(4001, 9001),
                null
        );

        FargateService analyticsService = createFargateService(
                "AnalyticsService",
                "analytics-service",
                List.of(4001),
                null
        );

        FargateService patientService = createFargateService(
                "PatientService",
                "patient-service",
                List.of(4000),
                Map.of(
                        "BILLING_SERVICE_ADDRESS", "host.docker.internal",
                        "BILLING_SERVICE_GRPC_PORT", "9001",
                        "SPRING_DATASOURCE_URL", "jdbc:postgresql://patient-service-db:5432/patient-service-db",
                        "SPRING_DATASOURCE_USERNAME", "postgres1",
                        "SPRING_DATASOURCE_PASSWORD", "postgres@1",
                        "SPRING_JPA_HIBERNATE_DDL_AUTO", "update",
                        "SPRING_SQL_INIT_MODE", "always",
                        "SPRING_DATASOURCE_HIKARI_INITIALIZATION_FAIL_TIMEOUT", "60000"
                )
        );

        patientService.getNode().addDependency(billingService);

        createApiGatewayService();
    }

    private Vpc createVpc() {
        return Vpc.Builder.create(this, "PatientManagementVPC")
                .vpcName("PatientManagementVPC")
                .maxAzs(2)
                .natGateways(0)
                .build();
    }

    private Cluster createEcsCluster() {
        return Cluster.Builder.create(this, "PatientManagementCluster")
                .vpc(vpc)
                .defaultCloudMapNamespace(
                        CloudMapNamespaceOptions.builder()
                                .name("patient-management.local")
                                .build())
                .build();
    }

    private FargateService createFargateService(
            String id,
            String imageName,
            List<Integer> ports,
            Map<String, String> additionalEnvVars)
    {
        FargateTaskDefinition taskDefinition = FargateTaskDefinition.Builder.create(this, id + "Task")
                .cpu(256)
                .memoryLimitMiB(512)
                .build();

        LogGroup logGroup = LogGroup.Builder.create(this, id + "LogGroup")
                .logGroupName("/ecs/" + imageName)
                .removalPolicy(RemovalPolicy.DESTROY)
                .retention(RetentionDays.ONE_DAY)
                .build();

        Map<String, String> envVars = new HashMap<>();
        envVars.put("SPRING_KAFKA_BOOTSTRAP_SERVERS",
                "localhost.localstack.cloud:4510,localhost.localstack.cloud:4511,localhost.localstack.cloud:4512");

        if (additionalEnvVars != null) {
            envVars.putAll(additionalEnvVars);
        }

        ContainerDefinitionOptions containerOptions = ContainerDefinitionOptions.builder()
                .image(ContainerImage.fromRegistry(imageName))
                .environment(envVars)
                .portMappings(ports.stream()
                        .map(port -> PortMapping.builder()
                                .containerPort(port)
                                .hostPort(port)
                                .protocol(Protocol.TCP)
                                .build())
                        .collect(Collectors.toList()))
                .logging(LogDriver.awsLogs(AwsLogDriverProps.builder()
                        .logGroup(logGroup)
                        .streamPrefix(imageName)
                        .build()))
                .build();

        taskDefinition.addContainer(imageName + "Container", containerOptions);

        return FargateService.Builder.create(this, id)
                .cluster(ecsCluster)
                .taskDefinition(taskDefinition)
                .assignPublicIp(false)
                .serviceName(imageName)
                .build();
    }

    private void createApiGatewayService() {
        FargateTaskDefinition taskDefinition = FargateTaskDefinition.Builder.create(this, "ApiGatewayTask")
                .cpu(256)
                .memoryLimitMiB(512)
                .build();

        LogGroup logGroup = LogGroup.Builder.create(this, "ApiGatewayLogGroup")
                .logGroupName("/ecs/api-gateway")
                .removalPolicy(RemovalPolicy.DESTROY)
                .retention(RetentionDays.ONE_DAY)
                .build();

        ContainerDefinitionOptions containerOptions = ContainerDefinitionOptions.builder()
                .image(ContainerImage.fromRegistry("api-gateway"))
                .environment(Map.of(
                        "SPRING_PROFILES_ACTIVE", "prod",
                        "AUTH_SERVICE_URL", "http://host.docker.internal:4005"
                ))
                .portMappings(List.of(4004).stream()
                        .map(port -> PortMapping.builder()
                                .containerPort(port)
                                .hostPort(port)
                                .protocol(Protocol.TCP)
                                .build())
                        .toList())
                .logging(LogDriver.awsLogs(AwsLogDriverProps.builder()
                        .logGroup(logGroup)
                        .streamPrefix("api-gateway")
                        .build()))
                .build();

        taskDefinition.addContainer("ApiGatewayContainer", containerOptions);

        FargateService.Builder.create(this, "ApiGateway")
                .cluster(ecsCluster)
                .taskDefinition(taskDefinition)
                .assignPublicIp(true)
                .serviceName("api-gateway")
                .build();
    }

    public static void main(final String[] args) {
        App app = new App(AppProps.builder().outdir("./cdk.out").build());

        StackProps props = StackProps.builder()
                .synthesizer(new BootstraplessSynthesizer())
                .build();

        new LocalStack(app, "localStack", props);
        System.out.println("App synthesizing in progress...");
        app.synth();
        System.out.println("App synthesized successfully! CDK output written to ./cdk.out");
    }
}