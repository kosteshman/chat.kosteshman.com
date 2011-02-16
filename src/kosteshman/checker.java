package kosteshman;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

@SuppressWarnings("serial")
public class checker extends HttpServlet{
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
		resp.setContentType("text/plain");
		resp.getWriter().print("Hello, damn world");
		
	}
}
