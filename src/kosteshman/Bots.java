package kosteshman;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Bots {

	@PrimaryKey
	@Persistent(valueStrategy=IdGeneratorStrategy.IDENTITY)
	private Long id;
	
	@Persistent
	private String jid;
	
	@Persistent
	private Date created;
	
	@Persistent
	private Boolean accessibility;
	
	@Persistent
	private Date lastuse;
	
	public Bots(String jid, Date created, Boolean accessibility){
		this.jid = jid;
		this.created = created;
		this.accessibility = accessibility;
	}
	
	public Long getId(){
		return this.id;
	}
	
	public String getJid(){
		return this.jid;
	}
	
	public Date getCreationDate(){
		return this.created;
	}
	
	public Boolean isAvalible(){
		return this.accessibility;
	}
	
	public Date getLastUse(){
		return this.lastuse;
	}
	
	public void use(){
		this.lastuse = new Date();
	}
	
	public void setJid(String jid){
		this.jid = jid;
	}
	
	public void setCreationDate(Date created){
		this.created = created;
	}
	
	public void setAccessability(Boolean accessability){
		this.accessibility = accessability;
	}
	
}
