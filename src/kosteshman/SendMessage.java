package kosteshman;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.AddressException;
import javax.mail.internet.MimeMessage;
import javax.mail.MessagingException;
import javax.servlet.http.*;
import com.google.appengine.api.xmpp.JID;
import com.google.appengine.api.xmpp.Message;
import com.google.appengine.api.xmpp.MessageBuilder;
import com.google.appengine.api.xmpp.XMPPService;
import com.google.appengine.api.xmpp.XMPPServiceFactory; 

@SuppressWarnings("serial")
public class SendMessage extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		String ret = "";
		String msg_text = req.getParameter("message");
		JID me = new JID("gusev.k.n@gmail.com");
		XMPPService xmpp = XMPPServiceFactory.getXMPPService();
		if(xmpp.getPresence(me).isAvailable()){
			HttpSession session = req.getSession();
			String jid_str = (String) session.getAttribute("bot_jid");
			if(jid_str != null){
				JID bot_jid = new JID(jid_str);
				Message mes = new MessageBuilder()
				.withBody(msg_text)
				.withFromJid(bot_jid)
				.withRecipientJids(me)
				.build();
				xmpp.sendMessage(mes);
				ret = "ok";
			}else{
				ret = "nobot";
			}
		}else{
			try {
				Properties props = new Properties();
				Session mail_session = Session.getDefaultInstance(props);
				javax.mail.Message mail_message = new MimeMessage(mail_session);
				mail_message.setFrom(new InternetAddress("k@kosteshman.com", "kosteshman's mail bot"));
				mail_message.addRecipient(javax.mail.Message.RecipientType.TO,
                        new InternetAddress("gusev.k.n@gmail.com", "Gusev Konstantin"));
				mail_message.setSubject("offline message from kosteshman.com");
				mail_message.setText(msg_text);
				Transport.send(mail_message);
				ret = "mail";
			} catch (AddressException e){
				ret = e.getMessage();
			} catch (MessagingException e) {
				ret = e.getMessage();
			}
		}
		
		resp.setContentType("text/plain");
		resp.getWriter().print(ret);
	}
}