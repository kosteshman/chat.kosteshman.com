package kosteshman;

import java.util.List;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheManager;
import net.sf.jsr107cache.CacheException;

import kosteshman.ChatMessage;

@SuppressWarnings("serial")
public class GetMessages extends HttpServlet{
	@SuppressWarnings("unchecked")
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		HttpSession session = req.getSession();
		String bot_jid = (String) session.getAttribute("bot_jid");
		String ret = "messages = [";
		Cache cache;
		try {
			cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
			if(cache.isEmpty() || !cache.containsKey(bot_jid)){
				ret+="];";
			}else{
				List<ChatMessage> messages =  new ArrayList<ChatMessage>();
				messages = (List<ChatMessage>)cache.get(bot_jid);
				if(messages.isEmpty()){
					ret+="];";
				}else{
					Integer ml = messages.size();
					Integer i = 0;
					for(ChatMessage m: messages){
						i++;
						String date = Long.toString(m.getDate().getTime());
						ret+="['"+m.getBody()+"', '"+date+"']";
						
						if(i < ml){
							ret+=",";
						}
					}
					ret+="];";
					cache.remove(bot_jid);
				}
				
			}
			
		} catch (CacheException e) {
			ret+="]; error = 'try error: "+e.getMessage()+"';";
		}
		
		resp.setContentType("text/plain;charset=UTF-8");
		resp.getWriter().print(ret);
		
	}
}
