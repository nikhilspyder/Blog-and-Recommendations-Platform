package com.backend.elasticsearch.repository;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.backend.elasticsearch.model.Alert;

@Repository
public interface AlertRepository extends ElasticsearchRepository<Alert,String> {

	@Query("{\"bool\": {\"must\": [{\"match\": {\"userName\": \"?0\"}}]}}")
	Alert findAllByUserName(String userName);
}
