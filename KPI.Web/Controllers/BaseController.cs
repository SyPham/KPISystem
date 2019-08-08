using KPI.Model.helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace KPI.Web.Controllers
{
    public class BaseController : Controller
    {
      
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var username = Session["UserName"].ToSafetyString();
            if (username == string.Empty)
            {
                filterContext.Result = new RedirectToRouteResult(new
                    RouteValueDictionary(new { controller = "Login", action ="Index"}));
            }
            base.OnActionExecuting(filterContext);
        }
    }
}