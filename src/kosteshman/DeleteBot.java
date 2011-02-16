package kosteshman;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



import kosteshman.Bots;
import kosteshman.PMF;

@SuppressWarnings("serial")
public class DeleteBot extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		Long id = Long.parseLong(req.getParameter("id"));
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Bots bot = pm.getObjectById(Bots.class, id);
		String result = "";
		try{
			pm.deletePersistent(bot);
			result="ok";
		}catch (Exception e) {
			result = "can't delete bot. Reason: "+e.getMessage();
		}finally{
			pm.close();
		}
		resp.setContentType("text/plain");
		resp.getWriter().print(result);
	}
}
