package kosteshman;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import kosteshman.PMF;
import kosteshman.Bots;

public class BotsFunctions {
	private BotsFunctions(){};
	/**
	 * Function returns JID for use with xmpp
	 * if no accessible bots returns NULL
	 * @return JID JID
	 */
	public static String getAvalible(){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Bots.class);
		@SuppressWarnings("unchecked")
		List<Bots> bots = (List<Bots>)query.execute();
		String selected_jid = "";
		
		for(Bots b: bots){
			if(b.isAvalible()){
				b.setAccessability(false);
				b.use();
				selected_jid = b.getJid();
				break;
			}
		}
		pm.close();
		
		if(selected_jid!=""){
			return selected_jid;
		}else{
			return null;
		}
	}
}
