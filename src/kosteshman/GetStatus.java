package kosteshman;

import javax.servlet.http.*;
import java.io.IOException;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.xmpp.JID;
import com.google.appengine.api.xmpp.Message;
import com.google.appengine.api.xmpp.MessageBuilder;
import com.google.appengine.api.xmpp.XMPPService;
import com.google.appengine.api.xmpp.XMPPServiceFactory; 

import kosteshman.BotsFunctions;

@SuppressWarnings("serial")
public class GetStatus extends HttpServlet{
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{	
		JID jid = new JID("gusev.k.n@gmail.com");
		XMPPService xmpp = XMPPServiceFactory.getXMPPService();
		String status = "";
		if(xmpp.getPresence(jid).isAvailable()){
			UserService userservice = UserServiceFactory.getUserService();
			User user = userservice.getCurrentUser();
			
			status = "online";
			HttpSession session = req.getSession();
			String bot_jid;
			String message;
			if(session.isNew()){
				bot_jid = BotsFunctions.getAvalible();
				session.setAttribute("bot_jid", bot_jid);
				message = "Пользователь зашел на сайт.";
				if(user!=null){
					message+="Авторизован в google: "+user.getNickname();
				}
			}else{
				 bot_jid = (String)session.getAttribute("bot_jid");
				 if(bot_jid == null){
					 bot_jid = BotsFunctions.getAvalible();
				 }
				 message = "Пользователь вернулся на сайт";
			}
			String dr = req.getParameter("referrer");
			if(dr != null){
				message+=" Пришел с "+dr;
			}
			
			JID bot = new JID(bot_jid);
			Message mes = new MessageBuilder()
				.withBody(message)
				.withFromJid(bot)
				.withRecipientJids(jid)
				.build();
			xmpp.sendMessage(mes);
			
		}else{
			status = "offline";
		}
		resp.setContentType("text/plain");
		resp.getWriter().print(status);
	}
}
