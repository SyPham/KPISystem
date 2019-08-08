using KPI.Model.EF;
using KPI.Model.helpers;
using KPI.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KPI.Model.DAO
{
    public class UserAdminDAO
    {
        KPIDbContext _dbContext = null;

        public UserAdminDAO()
        {
            this._dbContext = new KPIDbContext();
        }
        public int Add(EF.User entity)
        {
            entity.Code = entity.Code.ToSafetyString().ToUpper();
            List<EF.KPILevel> kpiLevelList = new List<EF.KPILevel>();

            //if (_dbContext.Users.FirstOrDefault(x => x.Code == code) != null)
            //{
            //    return 2;
            //}
            try
            {
                entity.Password = entity.Password.SHA256Hash();
                entity.State = true;
                entity.IsActive = true;
                _dbContext.Users.Add(entity);

                _dbContext.SaveChanges();

                IEnumerable<KPIViewModel> kpiVM = from kpi in _dbContext.KPIs
                                                  join cat in _dbContext.Categories on kpi.CategoryID equals cat.ID
                                                  select new KPIViewModel
                                                  {
                                                      KPIID = kpi.ID,
                                                  };
                foreach (var kpi in kpiVM)
                {
                    var kpilevel = new EF.KPILevel();
                    kpilevel.LevelID = entity.ID;
                    kpilevel.KPIID = kpi.KPIID;
                    kpiLevelList.Add(kpilevel);
                }
                _dbContext.KPILevels.AddRange(kpiLevelList);
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                return 0;
            }
        }
        public bool Update(EF.User entity)
        {
            var code = entity.Code.ToUpper().ToSafetyString();
            var item = _dbContext.Users.FirstOrDefault(x => x.ID == entity.ID);

            item.Username = entity.Username;
            item.Code = code;
            item.FullName = entity.FullName;
            item.Role = entity.Role;
            item.LevelID = entity.LevelID;
            try
            {
                _dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                //logging
                return false;
            }
        }
        public bool LockUser(int id)
        {
            var item = _dbContext.Users.FirstOrDefault(x => x.ID == id);
            item.IsActive = !item.IsActive;
            try
            {
                _dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                //logging
                return false;
            }
        }
        public bool ChangePassword(int id,string newpass)
        {
            var item = _dbContext.Users.FirstOrDefault(x => x.ID == id);
            item.Password = newpass;
            try
            {
                _dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                //logging
                return false;
            }
        }
        public bool AddUserToLevel(int id, int teamid)
        {
            var itemUser = _dbContext.Users.FirstOrDefault(x => x.ID == id);
            if (itemUser != null)
                itemUser.TeamID = teamid;

            try
            {
                _dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                //logging
                return false;
            }

        }
        public bool Delete(int ID)
        {
            var findUser = _dbContext.Users.FirstOrDefault(x => x.ID == ID);
            try
            {
                findUser.State = !findUser.State;
                _dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                return false;
            }

        }
        public IEnumerable<EF.User> GetAll()
        {
            return _dbContext.Users.Where(x => x.State == true).ToList();
        }
        public EF.User GetbyID(int ID)
        {
            return _dbContext.Users.FirstOrDefault(x => x.ID == ID);
        }


        public object GetPaggedData(int pageNumber = 1, int pageSize = 20)
        {
            List<EF.User> listData = _dbContext.Users.ToList();
            var pagedData = Pagination.PagedResult(listData, pageNumber, pageSize);
            return pagedData;
        }
        public object LoadData(string search, int page, int pageSize)
        {
            IQueryable<EF.User> model = _dbContext.Users;

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToUpper().ToSafetyString();
                model = model.Where(x => x.Code.Contains(search) || x.Username == search);
            }

            int totalRow = model.Count();

            model = model.OrderBy(x => x.LevelID)
              .Skip((page - 1) * pageSize)
              .Take(pageSize);


            return new
            {
                data = model,
                total = totalRow,
                status = true
            };
        }
        public object LoadDataUser(string code, int page, int pageSize)
        {
            IQueryable<EF.User> model = _dbContext.Users.Where(x => x.State == true);
            if (!string.IsNullOrEmpty(code))
            {
                model = model.Where(a => a.Username.Contains(code));
            }
            int totalRow = model.Count();

            model = model.OrderBy(x => x.LevelID)
              .Skip((page - 1) * pageSize)
              .Take(pageSize);


            return new
            {
                data = model,
                total = totalRow,
                status = true
            };
        }
        public int Total()
        {
            return _dbContext.Users.ToList().Count();
        }
        public object LoadDataUser(int teamid, string code, int page, int pageSize)
        {
            IQueryable<EF.User> model = _dbContext.Users.Where(x => x.State == true && x.TeamID == teamid);
            if (!string.IsNullOrEmpty(code))
            {
                model = model.Where(a => a.Username.Contains(code));
            }
            int totalRow = model.Count();

            model = model.OrderBy(x => x.LevelID)
              .Skip((page - 1) * pageSize)
              .Take(pageSize);


            return new
            {
                data = model,
                total = totalRow,
                status = true
            };
        }
    }
}
