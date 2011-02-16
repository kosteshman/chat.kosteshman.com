package kosteshman;

import java.io.IOException;
import java.util.Date;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.xmpp.JID;
import com.google.appengine.api.xmpp.XMPPService;
import com.google.appengine.api.xmpp.XMPPServiceFactory;

import kosteshman.Bots;
import kosteshman.PMF;

@SuppressWarnings("serial")
public class AddNewBot extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
		JID my_jid = new JID("gusev.k.n@gmail.com");
		XMPPService xmpp = XMPPServiceFactory.getXMPPService();
		String jid = req.getParameter("jid");
		JID from_jid = new JID(jid);
		xmpp.sendInvitation(my_jid, from_jid);
		Date date = new Date();
		Boolean accessibility = true;
		Bots bot = new Bots(jid, date, accessibility);
		PersistenceManager pmf  = PMF.get().getPersistenceManager();
		String result = "";
		try{
			pmf.makePersistent(bot);
			result = bot.getId().toString();
		}catch (Exception e) {
			result = "can't create new bot. Reason: "+e.getMessage();
		}finally{
			pmf.close();
		}
		resp.setContentType("text/plain");
		resp.getWriter().print(result);
	}
}
