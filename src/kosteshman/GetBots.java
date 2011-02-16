package kosteshman;

import java.io.IOException;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.jdo.Query;

import kosteshman.PMF;
import kosteshman.Bots;

@SuppressWarnings("serial")
public class GetBots extends HttpServlet{
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		String ret = "bots = [";
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Bots.class);
		@SuppressWarnings("unchecked")
		List<Bots> results = (List<Bots>) query.execute();
		if(!results.isEmpty()){
			for(Bots b : results){
				ret+="["+b.getId().toString()+",'"+b.getJid()+"','"+b.getCreationDate().toString()+"', "+b.isAvalible()+"],";
			}
			
			ret = ret.substring(0, ret.length()-1);
		}
		ret+="]";
		
		resp.setContentType("text/plain");
		resp.getWriter().print(ret);
	}
}
