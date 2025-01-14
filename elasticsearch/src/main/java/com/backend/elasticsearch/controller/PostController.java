package com.backend.elasticsearch.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.backend.elasticsearch.model.Post;
import com.backend.elasticsearch.service.PostService;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
	
	private static final Logger LOGGER = LogManager.getLogger(PostController.class);
	
	@Autowired
    private PostService postService;
	
//	@Autowired
//	private RestTemplate restTemplate;

    @PostMapping("/createPost")
    public ResponseEntity<Post> createPost(@RequestBody Post post) {

    	LOGGER.info("Inside ApplicationController - createPost");
        try{
        	Post response = postService.createPost(post);
            LOGGER.info("Executed ApplicationController - createPost");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/getPost")
    public ResponseEntity<Iterable<Post>> getPost(@RequestParam(required = false) String topic) {

    	LOGGER.info("Inside ApplicationController - getPost");
        try{
        	Iterable<Post> response = postService.getPost(topic);
            LOGGER.info("Executed ApplicationController - getPost");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/getPost/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {

    	LOGGER.info("Inside ApplicationController - getPostById");
        try{
        	Post response = postService.getPostById(id);
            LOGGER.info("Executed ApplicationController - getPostById");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/updatePost")
    public ResponseEntity<Post> updatePost(@RequestBody Post post) {

    	LOGGER.info("Inside ApplicationController - updatePost");
        try{
        	Post response = postService.updatePost(post);
            LOGGER.info("Executed ApplicationController - updatePost");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {

    	LOGGER.info("Inside ApplicationController - deletePost");
        try{
        	boolean response = postService.deletePost(id);
            LOGGER.info("Executed ApplicationController - deletePost");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("");
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PostMapping("/subscribeTopic")
    public ResponseEntity<Boolean> subscribeTopic(@RequestParam String userName, @RequestParam String topic) {

    	LOGGER.info("Inside ApplicationController - subscribeTopic");
        try{
        	Boolean response = postService.subscribeTopic(userName, topic);
            LOGGER.info("Executed ApplicationController - subscribeTopic");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/getSubscribeTopic")
    public ResponseEntity<?> getSubscribeTopic(@RequestParam String topic) {

    	LOGGER.info("Inside ApplicationController - getSubscribeTopic");
        try{
        	List<String> response = postService.getSubscribeTopic(topic);
            LOGGER.info("Executed ApplicationController - getSubscribeTopic");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/unsubscribeTopic")
    public ResponseEntity<Boolean> unsubscribeTopic(@RequestParam String userName, @RequestParam String topic) {

    	LOGGER.info("Inside ApplicationController - unsubscribeTopic");
        try{
        	Boolean response = postService.unsubscribeTopic(userName, topic);
            LOGGER.info("Executed ApplicationController - unsubscribeTopic");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PostMapping("/createAlert")
    public ResponseEntity<Boolean> createAlert(@RequestParam String userName, @RequestParam String topic) {

    	LOGGER.info("Inside ApplicationController - createAlert");
        try{
        	Boolean response = postService.createAlert(userName, topic);
            LOGGER.info("Executed ApplicationController - createAlert");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/getAlert")
    public ResponseEntity<?> getAlert(@RequestParam String userName) {

    	LOGGER.info("Inside ApplicationController - getAlert");
        try{
        	List<String> response = postService.getAlert(userName);
            LOGGER.info("Executed ApplicationController - getAlert");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/deleteAlert")
    public ResponseEntity<Boolean> deleteAlert(@RequestParam String userName, @RequestParam String topic) {

    	LOGGER.info("Inside ApplicationController - deleteAlert");
        try{
        	Boolean response = postService.deleteAlert(userName, topic);
            LOGGER.info("Executed ApplicationController - deleteAlert");
            LOGGER.info("response - " + response);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }catch(Exception e){
            LOGGER.error("Caught Exception - "+ e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
//    @GetMapping("/search-restaurant")
//    public ResponseEntity<?> restaurant(@RequestParam String restaurantName) {
//
//    	LOGGER.info("Inside ApplicationController - getAlert");
//        try{
//        	
//        	String url = "https://serpapi.com/search.json?q= " + restaurantName + 
//        			"&uule=w+CAIQICIeQ2hpY2FnbyxJbGxpbm9pcyxVbml0ZWQgU3RhdGVz&tbm=lcl&apikey=71774fc3c49517eb44bf836681f4033d32d5cb7af62e9ac2534f214b8619ebe7";
//        	
//        	restTemplate.getForEntity(url, null, null);
//        	
//            LOGGER.info("Executed ApplicationController - getAlert");
//            LOGGER.info("response - " + response);
//            return ResponseEntity.status(HttpStatus.OK).body(response);
//        }catch(Exception e){
//            LOGGER.error("Caught Exception - "+ e);
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
    
//    @GetMapping("/searchRestaurant")
//    public ResponseEntity<?> searchRestaurant(@RequestParam String restaurantName) {
//
//    	LOGGER.info("Inside ApplicationController - searchRestaurant");
//        try{
//        	List<String> response = postService.searchRestaurant(restaurantName);
//            LOGGER.info("Executed ApplicationController - getAlert");
//            LOGGER.info("response - " + response);
//            return ResponseEntity.status(HttpStatus.OK).body(response);
//        }catch(Exception e){
//            LOGGER.error("Caught Exception - "+ e);
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
    
    
//    app.get('/search-restaurant', async (req, res) => {
//    	  const apiKey = '71774fc3c49517eb44bf836681f4033d32d5cb7af62e9ac2534f214b8619ebe7';
//    	  let { restaurantName } = req.query;
//
//    	  // Encode the restaurantName parameter
//    	  restaurantName = encodeURIComponent(restaurantName);
//
//    	  const apiUrl = `https://serpapi.com/search.json?q=${restaurantName}&uule=w+CAIQICIeQ2hpY2FnbyxJbGxpbm9pcyxVbml0ZWQgU3RhdGVz&tbm=lcl&apikey=${apiKey}`;
//
//    	  try {
//    	      const response = await fetch(apiUrl);
//    	      const searchData = await response.json();
//    	      res.json(searchData);
//    	  } catch (error) {
//    	      console.error('Error fetching SERP API:', error);
//    	      res.status(500).json({ error: 'Internal Server Error' });
//    	  }
//    	});
    
}
