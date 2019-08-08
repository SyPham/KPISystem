$(document).ready(function () {
    adminUserController.init();
});
var userConfig = {
    pageSize: 6,
    pageIndex: 1
};
var kpiLevelConfig = {
    pageSize: 6,
    pageIndex: 1
};
var adminUserController = {
    init: function () {
        adminUserController.loadData();
        adminUserController.loadDataRole();
        adminUserController.registerEvent();

    },
    registerEvent: function () {
        $('#search').off('keypress').on('keypress', function (e) {
            if (e.which === 13) {
                adminUserController.loadData(true);
            }
        });
        $('#box select').off('change').on('change', function (e) {
            var code = $(this).parent().children('.code').text();
            adminUserController.loadDataKPILevel(true, code);
        });
        //Save KPI
        $('#btnAdd').off('click').on('click', function () {
            adminUserController.addData();
            adminUserController.loadData();

        });
        //Delete
        $('#btnDelete').off('click').on('click', function () {

        });
        //Update
        $('.btnUpdate').off('click').on('click', function () {
            //load detail
            adminUserController.loadDetail(Number($(this).data('id')));
        });
        //save
        $('#btnSaveUpdateModal').off('click').on('click', function () {
            adminUserController.updateData();
            adminUserController.loadData();
        });
        //delete
        $('.btnDelete').off('click').on('click', function () {
            adminUserController.deleteData($(this).data('id'));
        });
        //delete
        $('.IsActive').off('click').on('click', function () {
            adminUserController.lockUser(Number($(this)));
            adminUserController.loadData();
        });
    },
    addData: function () {
        var res = adminUserController.validate();
        if (res === false) {
            return false;
        }
        var mObj = {
            Code: $('#addKPI .Code').val(),
            Username: $('#addKPI .Username').val(),
            Password: $('#addKPI .Password').val(),
            LevelID: $('#addKPI .LevelID').val(),
            Role: $('#addKPI .Role').val(),
            FullName: $('#addKPI .FullName').val()
        };
        $.ajax({
            url: "/AdminUser/Add",
            data: JSON.stringify(mObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result === 1) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Add successfully!',
                        type: 'success',
                        confirmButtonText: 'OK'
                    });
                    $("#modal-group").modal('hide');
                    adminUserController.loadData(true);
                    adminUserController.resetForm();
                }
                else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'This code has already existed!',
                        type: 'error'
                    });
                }

            },
            error: function (errormessage) {
                console.log(errormessage.responseText);
            }
        });
    },
    deleteData: function (id) {
        var ID = id;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: "/AdminUser/Delete/" + ID,
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    success: function (result) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Delete successfully.',
                            type: 'success'
                        });
                        adminUserController.loadData();
                        $("#modal-group").modal('hide');
                    },
                    error: function (errormessage) {
                        console.log(errormessage.responseText);
                    }
                });
                Swal.fire(
                    'Deleted!',
                    'Reacord has been deleted.',
                    'success'
                );
            }
        });

    },
    resetForm: function () {
        $('.ID').val("");
        $('.Username').val("");
        $('.Password').val("");
        $('.Code').val("");
        $('.LevelID').val("");
        $('.Role').val("");
        $('.FullName').val("");
        $('.Username').css('border-color', 'lightgrey');
        $('.Password').css('border-color', 'lightgrey');
        $('.Code').css('border-color', 'lightgrey');
        $('.LevelID').css('border-color', 'lightgrey');
        $('.Role').css('border-color', 'lightgrey');
        $('.FullName').css('border-color', 'lightgrey');
    },
    updateData: function (id, name, code, levelID) {
        var mObj = {
            ID: $('#updateKpi .ID').val(),
            Username: $('#updateKpi .Username').val(),
            Code: $('#updateKpi .Code').val(),
            LevelID: $('#updateKpi .LevelID').val()
        };

        $.ajax({
            url: "/AdminUser/Update",
            data: JSON.stringify(mObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Update successfully!',
                        type: 'success'
                    });
                    adminUserController.resetForm();
                    $("#modal-group2").modal('hide');
                    adminUserController.loadData(true);

                }

            },
            error: function (error) {
                console.log(error);
            }
        });
    },
    updateKPILevel: function (KPICode, CodeKPILevel, UserCheck, Checked, WeeklyChecked, MonthlyChecked, QuaterlyChecked, YearlyChecked, Weekly, Monthly, Quaterly, Yearly, TimeCheck, TableID) {
        var mObj = {
            KPICode: KPICode,
            Code: CodeKPILevel,
            UserCheck: UserCheck,
            Checked: Checked,
            WeeklyChecked: WeeklyChecked,
            MonthlyChecked: MonthlyChecked,
            QuaterlyChecked: QuaterlyChecked,
            YearlyChecked: YearlyChecked,
            Weekly: Weekly,
            Monthly: Monthly,
            Quaterly: Quaterly,
            Yearly: Yearly,
            TimeCheck: TimeCheck,
            TableID: TableID
        };

        $.ajax({
            url: "/AdminUser/UpdateKPILevel",
            data: JSON.stringify(mObj),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {

                if (result) {

                    Swal.fire({
                        title: 'Success!',
                        text: 'Update successfully!',
                        type: 'success'
                    });

                }
            },
            error: function (errormessage) {
                console.log(errormessage.responseText);
            }
        });
    },
    loadDetail: function (id) {
        var value = id;
        $.ajax({
            url: "/AdminUser/GetbyID/",
            data: { ID: JSON.stringify(value) },
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                $('#updateKpi .ID').val(result.ID);
                $('#updateKpi .Username').val(result.Username);
                $('#updateKpi .Code').val(result.Code);
                $('#updateKpi .LevelID').val(result.LevelID);
                $('#updateKpi .Role').val(result.ID);
                $('#updateKpi .FullName').val(result.LevelID);
                $('#modal-group2').modal('show');

            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    loadDataRole: function () {
        $.ajax({
            url: '/AdminUser/GetListAllRole',
            type: "GET",
            dataType: "json",
            success: function (data) {
                $("#modal-group2 select, #modal-group select").empty();
                $("#modal-group2 select,#modal-group select").append('<option value="">.: Choose Category :.</option>');

                //console.log(data);
                $.each(data, function (key, item) {
                    $(".Role").append("<option value=\"" + item.ID + "\">" + item.Name + "</option>");
                });
            }
        });
    },
    lockUser: function () {
        var ID = id;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: "/AdminUser/LockUser/" + ID,
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    success: function (result) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Locked successfully.',
                            type: 'success'
                        });
                        adminUserController.loadData();
                        $("#modal-group").modal('hide');
                    },
                    error: function (errormessage) {
                        console.log(errormessage.responseText);
                    }
                });
                Swal.fire(
                    'Deleted!',
                    'Reacord has been deleted.',
                    'success'
                );
            }
        });
    },
    validate: function () {
        var isValid = true;
        if ($('.Username').val().trim() === "") {
            $('.Username').css('border-color', 'Red');
            isValid = false;
        }
        else {
            $('.Username').css('border-color', 'lightgrey');
        }
        //if ($('.Code').val().trim() === "") {
        //    $('.Code').css('border-color', 'Red');
        //    isValid = false;
        //}
        //else {
        //    $('.Code').css('border-color', 'lightgrey');
        //}
        if ($('.Password').val().trim() === "") {
            $('.Password').css('border-color', 'Red');
            isValid = false;
        }
        else {
            $('.Password').css('border-color', 'lightgrey');
        }
        if ($('.FullName').val().trim() === "") {
            $('.FullName').css('border-color', 'Red');
            isValid = false;
        }
        else {
            $('.FullName').css('border-color', 'lightgrey');
        }
        if ($('.Role').val().trim() === "") {
            $('.Role').css('border-color', 'Red');
            isValid = false;
        }
        else {
            $('.Role').css('border-color', 'lightgrey');
        }
        if ($('.LevelID').val().trim() === "") {
            $('.LevelID').css('border-color', 'Red');
            isValid = false;
        }
        else {
            $('.LevelID').css('border-color', 'lightgrey');
        }
        return isValid;
    },
    loadData: function (changePageSize) {
        var search = $('#search').val();

        $.ajax({
            url: '/AdminUser/LoadData/',
            type: 'GET',
            data: {
                search: search,
                page: userConfig.pageIndex,
                pageSize: userConfig.pageSize
            },
            dataType: 'json',
            beforeSend: function () {
                $("#main-loading-delay").show();
            },
            success: function (response) {

                if (response.status) {
                    $("#main-loading-delay").hide();
                    var count = 1;
                    //console.log(response.data);
                    var data = response.data;
                    var html = '';
                    var template = $('#tbluser-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            No: count,
                            Username: item.Username,
                            Password: item.Password,
                            FullName: item.FullName,
                            Code: item.Code,
                            Level: item.LevelID,
                            IDStatus: item.ID,
                            State: item.IsActive === true ? "" : "checked",
                            Label: item.IsActive === true ? "Unlocked" : "Locked",
                            Role:item.Role,
                            ID: item.ID,
                            IDDelete: item.ID
                        });
                        count++;
                    });
                    $('#tbluser').html(html);
                    adminUserController.paging(response.total, function () {
                        adminUserController.loadData();
                    }, changePageSize);
                    adminUserController.registerEvent();
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    paging: function (totalRow, callback, changePageSize) {
        var totalPage = Math.ceil(totalRow / userConfig.pageSize);

        //Unbind pagination if it existed or click change pagesize
        if ($('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
        }

        $('#pagination').twbsPagination({
            totalPages: totalPage === 0 ? 1 : totalPage,
            first: "First",
            next: "Next",
            last: "Last",
            prev: "Previous",
            visiblePages: 10,
            onPageClick: function (event, page) {
                userConfig.pageIndex = page;
                setTimeout(callback, 500);
            }
        });
    }
};
