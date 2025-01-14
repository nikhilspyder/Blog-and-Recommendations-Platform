package com.backend.elasticsearch.repository;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.backend.elasticsearch.model.SubscribeTopic;

@Repository
public interface SubscriptionTopicRepository extends ElasticsearchRepository<SubscribeTopic,String>{

	@Query("{\"bool\": {\"must\": [{\"match\": {\"topic\": \"?0\"}}]}}")
	SubscribeTopic findAllByTopic(String topic);

}
