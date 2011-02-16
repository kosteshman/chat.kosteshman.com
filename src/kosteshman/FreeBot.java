package kosteshman;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kosteshman.PMF;
import kosteshman.Bots;

@SuppressWarnings("serial")
public class FreeBot extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		Long id = Long.parseLong(req.getParameter("id"));
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Bots bot = (Bots)pm.getObjectById(Bots.class, id);
		String ret;
		try{
			bot.setAccessability(true);
			ret = "ok";
		}catch(Exception e){
			ret = "Can't free bot. Reason: "+e.getMessage();
		}finally{
			pm.close();
		}
		
		resp.setContentType("text/plain");
		resp.getWriter().print(ret);
	}
}
