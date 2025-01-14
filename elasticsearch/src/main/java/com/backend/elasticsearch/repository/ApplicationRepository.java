package com.backend.elasticsearch.repository;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.backend.elasticsearch.model.Post;

@Repository
public interface ApplicationRepository extends ElasticsearchRepository<Post,String>{

	@Query("{\"bool\": {\"must\": [{\"match\": {\"topic\": \"?0\"}}]}}")
	Iterable<Post> findPostsByTopic(String id);

}
