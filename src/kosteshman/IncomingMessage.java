package kosteshman;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheManager;

import com.google.appengine.api.xmpp.Message;
import com.google.appengine.api.xmpp.XMPPService;
import com.google.appengine.api.xmpp.XMPPServiceFactory;

import kosteshman.ChatMessage;

@SuppressWarnings("serial")
public class IncomingMessage extends HttpServlet{
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
		XMPPService xmpp = XMPPServiceFactory.getXMPPService();
		Message xmpp_message = xmpp.parseMessage(req);		
		String from_jid = xmpp_message.getFromJid().getId();
		String body = xmpp_message.getBody();
		String bot_jid = xmpp_message.getRecipientJids()[0].getId();
		bot_jid = bot_jid.substring(0, bot_jid.indexOf('/'));
		ChatMessage mes = new ChatMessage(from_jid, bot_jid, body);
		Cache cache;
		try{
			cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
			if(cache.containsKey(bot_jid)){
				@SuppressWarnings("unchecked")
				List<ChatMessage> cml = (List<ChatMessage>)cache.get(bot_jid);
				cml.add(mes);
			}else{
				List<ChatMessage> cml = new ArrayList<ChatMessage>();
				cml.add(mes);
				cache.put(bot_jid, cml);
			}
		}catch(CacheException e){
				
		}		
	}
}
