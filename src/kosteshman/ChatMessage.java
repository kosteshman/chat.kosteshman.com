package kosteshman;

import java.io.Serializable;
import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@SuppressWarnings("serial")
@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class ChatMessage implements Serializable {

	@PrimaryKey
	@Persistent(valueStrategy=IdGeneratorStrategy.IDENTITY)
	private Long id;
	
	@Persistent
	private Date date;
	
	@Persistent
	private String body;
	
	@Persistent
	private String from;
	
	@Persistent
	private String to;
	
	public Long getId(){
		return this.id;
	}
	
	public ChatMessage(String from, String to, String body){
		this.from = from;
		this.to = to;
		this.body = body;
		this.date = new Date();
	}
	
	public void setFrom(String from){
		this.from = from;
	}
	
	public void setTo(String to){
		this.to = to;
	}
	
	public void setBody(String body){
		this.body = body;
	}
	
	public void setDate(Date date){
		this.date = date;
	}
	
	public String getFrom(){
		return this.from;
	}
	
	public String getTo(){
		return this.to;
	}
	
	public String getBody(){
		return this.body;
	}
	
	public Date getDate(){
		return this.date;
	}	
}
