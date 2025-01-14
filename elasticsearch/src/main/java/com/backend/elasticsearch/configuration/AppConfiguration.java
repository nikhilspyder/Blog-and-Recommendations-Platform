package com.backend.elasticsearch.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.backend.elasticsearch.repository")
@ComponentScan(basePackages = { "com.backend.elasticsearch.*" })
public class AppConfiguration {


//	@Bean
//    public RestHighLevelClient client() {
//		ClientConfiguration clientConfiguration  = ClientConfiguration.builder()
//                .connectedTo("localhost:9200")
//                .build();
// 
//        return RestClients.create(clientConfiguration).rest();
//    }
// 
//    @Bean
//    public ElasticsearchOperations elasticsearchTemplate() {
//        return new ElasticsearchRestTemplate(client());
//    }

}
