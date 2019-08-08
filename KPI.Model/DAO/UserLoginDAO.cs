﻿using KPI.Model.EF;
using KPI.Model.helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KPI.Model.DAO
{
  public  class UserLoginDAO
    {
        KPIDbContext _dbContext = null;

        public UserLoginDAO()
        {
            this._dbContext = new KPIDbContext();
        }
        public User GetUserProfile(string Username,string Password)
        {
            Password = Password.SHA256Hash();
            return _dbContext.Users.FirstOrDefault(x => x.Username.Equals(Username)&&x.Password.Equals(Password) &&x.State==true);
        }
        public int Login(string userName, string passWord, bool isLoginAdmin = false)
        {
            var result = _dbContext.Users.SingleOrDefault(x => x.Username == userName);
            if (result == null)
            {
                return 0;
            }
            else
            {
                if (isLoginAdmin == true)
                {
                    if (result.Role == 1 || result.Role == 2)
                    {
                        if (result.IsActive == false)
                        {
                            return -1;
                        }
                        else
                        {
                            if (result.Password == passWord)
                                return 1;
                            else
                                return -2;
                        }
                    }
                    else
                    {
                        return -3;
                    }
                }
                else
                {
                    if (result.IsActive == false)
                    {
                        return -1;
                    }
                    else
                    {
                        if (result.Password == passWord)
                            return 1;
                        else
                            return -2;
                    }
                }
            }
        }
    }
}
