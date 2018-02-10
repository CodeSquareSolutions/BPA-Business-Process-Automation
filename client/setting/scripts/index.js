$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
     $("#menu-toggle-2").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled-2");
        $('#menu ul').hide();
    });
 
     function initMenu() {
      $('#menu ul').hide();
      $('#menu ul').children('.current').parent().show();
      //$('#menu ul:first').show();
      $('#menu li a').click(
        function() {
          var checkElement = $(this).next();
          if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            return false;
            }
          if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#menu ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
            return false;
            }
          }
        );
      }
  $(document).ready(function() {initMenu();});

$( "#applicant" ).css( "display" , "block" );
$( "#applicantLink" ).addClass( "active" );
$("#rolePermissions").unbind("click");
$("#rolePermissions").bind("click", function () {
    addPermission('applicant');
});


$( "#applicantLink" ).click(function(){ 
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#applicant" ).css("display" , "none");
    $( "#applicantLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#ceo" ).css("display" , "none");
    $( "#ceoLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#leave" ).css("display" , "none");
    $( "#leaveLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#supervisor" ).css("display" , "none");
    $( "#supervisorLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#test" ).css("display" , "none");
    $( "#testLink" ).removeClass( "active" );
    $("#rolePermissions").unbind("click");
    $("#rolePermissions").bind("click", function () {
        addPermission('applicant');
    });
    $.get("http://localhost:3000/api/Roles", function( data ) {
        data.forEach(function(role) {
            $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
            $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');    
        });
    });

    $( "#applicant" ).css( "display" , "block" );
    $( "#applicantLink" ).addClass( "active" );

    //uncheck all ACL operations...
    $('#idView').prop('checked', false);
    $('#idAdd').prop('checked', false);
    $('#idUpdate').prop('checked', false);
    $('#idDelete').prop('checked', false);
    $('#idRelations').prop('checked', false);    
});

$( "#ceoLink" ).click(function(){ 
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#applicant" ).css("display" , "none");
    $( "#applicantLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#ceo" ).css("display" , "none");
    $( "#ceoLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#leave" ).css("display" , "none");
    $( "#leaveLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#supervisor" ).css("display" , "none");
    $( "#supervisorLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#test" ).css("display" , "none");
    $( "#testLink" ).removeClass( "active" );
    $("#rolePermissions").unbind("click");
    $("#rolePermissions").bind("click", function () {
        addPermission('ceo');
    });
    $.get("http://localhost:3000/api/Roles", function( data ) {
        data.forEach(function(role) {
            $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
            $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');    
        });
    });

    $( "#ceo" ).css( "display" , "block" );
    $( "#ceoLink" ).addClass( "active" );

    //uncheck all ACL operations...
    $('#idView').prop('checked', false);
    $('#idAdd').prop('checked', false);
    $('#idUpdate').prop('checked', false);
    $('#idDelete').prop('checked', false);
    $('#idRelations').prop('checked', false);    
});

$( "#leaveLink" ).click(function(){ 
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#applicant" ).css("display" , "none");
    $( "#applicantLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#ceo" ).css("display" , "none");
    $( "#ceoLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#leave" ).css("display" , "none");
    $( "#leaveLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#supervisor" ).css("display" , "none");
    $( "#supervisorLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#test" ).css("display" , "none");
    $( "#testLink" ).removeClass( "active" );
    $("#rolePermissions").unbind("click");
    $("#rolePermissions").bind("click", function () {
        addPermission('leave');
    });
    $.get("http://localhost:3000/api/Roles", function( data ) {
        data.forEach(function(role) {
            $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
            $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');    
        });
    });

    $( "#leave" ).css( "display" , "block" );
    $( "#leaveLink" ).addClass( "active" );

    //uncheck all ACL operations...
    $('#idView').prop('checked', false);
    $('#idAdd').prop('checked', false);
    $('#idUpdate').prop('checked', false);
    $('#idDelete').prop('checked', false);
    $('#idRelations').prop('checked', false);    
});

$( "#supervisorLink" ).click(function(){ 
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#applicant" ).css("display" , "none");
    $( "#applicantLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#ceo" ).css("display" , "none");
    $( "#ceoLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#leave" ).css("display" , "none");
    $( "#leaveLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#supervisor" ).css("display" , "none");
    $( "#supervisorLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#test" ).css("display" , "none");
    $( "#testLink" ).removeClass( "active" );
    $("#rolePermissions").unbind("click");
    $("#rolePermissions").bind("click", function () {
        addPermission('supervisor');
    });
    $.get("http://localhost:3000/api/Roles", function( data ) {
        data.forEach(function(role) {
            $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
            $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');    
        });
    });

    $( "#supervisor" ).css( "display" , "block" );
    $( "#supervisorLink" ).addClass( "active" );

    //uncheck all ACL operations...
    $('#idView').prop('checked', false);
    $('#idAdd').prop('checked', false);
    $('#idUpdate').prop('checked', false);
    $('#idDelete').prop('checked', false);
    $('#idRelations').prop('checked', false);    
});

$( "#testLink" ).click(function(){ 
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#applicant" ).css("display" , "none");
    $( "#applicantLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#ceo" ).css("display" , "none");
    $( "#ceoLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#leave" ).css("display" , "none");
    $( "#leaveLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#supervisor" ).css("display" , "none");
    $( "#supervisorLink" ).removeClass( "active" );
    $("#DeleteDetails").css("display", "none");
    $("#UpdateDetails").css("display", "none");
    $("#AddDetails").css("display", "none");
    $("#ViewDetails").css("display", "none");
    $("#infoi").css("display", "none");
    $("#propertySetting").css('display', 'none');
    $('#aclSelectRole').html('');
    $( "#test" ).css("display" , "none");
    $( "#testLink" ).removeClass( "active" );
    $("#rolePermissions").unbind("click");
    $("#rolePermissions").bind("click", function () {
        addPermission('test');
    });
    $.get("http://localhost:3000/api/Roles", function( data ) {
        data.forEach(function(role) {
            $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
            $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');    
        });
    });

    $( "#test" ).css( "display" , "block" );
    $( "#testLink" ).addClass( "active" );

    //uncheck all ACL operations...
    $('#idView').prop('checked', false);
    $('#idAdd').prop('checked', false);
    $('#idUpdate').prop('checked', false);
    $('#idDelete').prop('checked', false);
    $('#idRelations').prop('checked', false);    
});


function ShowSecond() {
    var div2 = document.getElementById("div2");
    div2.className = "show";
    setTimeout(function() {
    div2.className = "hide";
    }, 3000);
  }
function showPanel() {
    var div = document.getElementById('infoi');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
        div.classList.add('animate');
        div.classList.remove('lightSpeedIn');
        div.classList.add('lightSpeedOut');
    } else {
        div.style.display = 'block';
        div.classList.add('animate');
        div.classList.remove('lightSpeedOut');
        div.classList.add('zoomIn');
    }
}
function addRole(){
  var roleName = $('#roleName').val();
  var roleDescription = $('#roleDescription').val();
  
  $.post("http://localhost:3000/api/Roles", {"name" : roleName , "description": roleDescription,"created": new Date(), "modified": new Date()} , function(response){
     console.log("Roles");
    }).done(function() {
        $('#roleName').val('');
        $('#roleDescription').val('');
    }).fail(function() {
        alert("Role can't be inserted");
    })
  $("#roleTable").find("tr:gt(0)").remove();                          //=> remove all roles from table
  $('#aclSelectRole').html('');
  $.get("http://localhost:3000/api/Roles", function( data ) {
    data.push({
        "name" : "$everyOne",
        "description" : "Loopback default role"
    },{
        "name" : "$owner",
        "description" : "Loopback default role"
    },{
        "name" : "$authenticated",
        "description" : "Loopback default role"
    },{
        "name" : "$unauthenticated",
        "description" : "Loopback default role"
    });
    data.forEach(function(role) {
      $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
       $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');    
    });
  });
}

function hideInfoi() {
    $("#infoi").hide();
}
$('#idView').change(function() {
    if ($(this).is(':checked')) {
        // Checkbox is checked..
        $("#ViewDetails").css("display", "block");
    } else {
        // Checkbox is not checked..
        $("#ViewDetails").css("display", "none");
    }
});
$('#idAdd').change(function() {
    if ($(this).is(':checked')) {
        // Checkbox is checked..
        $("#AddDetails").css("display", "block");
    } else {
        // Checkbox is not checked..
        $("#AddDetails").css("display", "none");
    }
});
$('#idUpdate').change(function() {
    if ($(this).is(':checked')) {
        // Checkbox is checked..
        $("#UpdateDetails").css("display", "block");
    } else {
        // Checkbox is not checked..
        $("#UpdateDetails").css("display", "none");
    }
});
$('#idDelete').change(function() {
    if ($(this).is(':checked')) {
        // Checkbox is checked..
        $("#DeleteDetails").css("display", "block");

    } else {
        // Checkbox is not checked..
        $("#DeleteDetails").css("display", "none");
    }
});
$('#idRelations').change(function() {
    if ($(this).is(':checked')) {
        // Checkbox is checked..
        $("#RelationsDetails").css("display", "block");

    } else {
        // Checkbox is not checked..
        $("#RelationsDetails").css("display", "none");
    }
});