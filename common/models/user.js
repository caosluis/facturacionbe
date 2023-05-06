var config = require('../../server/config.json');
var path = require('path');

//Replace this address with your actual address
var senderAddress = 'noreply@SIFE.com';

module.exports = function (User) {
  User.afterRemote('create', function (context, user, next) {
    var options = {
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };

    user.verify(options, function (err, response) {
      if (err) {
        User.deleteById(user.id);
        return next(err);
      }
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
          'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  // Method to render
  User.afterRemote('prototype.verify', function (context, user, next) {
    context.res.render('response', {
      title: 'A Link to reverify your identity has been sent ' +
        'to your email successfully',
      content: 'Please check your email and click on the verification link ' +
        'before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });

  //send password reset link when requested
  User.on('resetPasswordRequest', function (info) {
    var url = 'http://localhost:4200/reset';
    var html = `<style type="text/css">
    td {
      border-bottom: solid 1px #DDD;
    }
  
    .icono {
      width: 30px;
    }
  
    .nombres {
      width: 130px;
    }
  
    .icono .nombres {
      background: #CCC;
    }
  
    table {
      margin-left: 5%;
    }
  
    a {
      text-decoration: none;
    }
  
    .x_logo {
      background-color: #064B74;
      color: #FFFFFF !important;
      font-family: "Arial Black", Gadget, sans-serif;
      font-size: 50px;
      text-align: right;
      vertical-align: text-bottom;
      padding-right: 20px;
      height: 70px;
      font-weight: bold;
    }
  
    .x_tab {
      font-family: "Segoe UI Light", "MALgun Gothic";
      color: #333;
      text-align: justify;
      background-color: #FFF;
      font-style: normal;
      font-size: 14px;
    }
  
    .x_pie {
      background-color: #064B74;
      color: #FFFFFF;
      font-family: Arial;
      font-size: 12px;
      font-style: normal;
      text-align: justify;
      padding-left: 5px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  </style>
  <div style="background-color: #FFF; width: 80%; font-family: arial, serif, EmojiFont;">
    <table>
      <thead>
        <tr>
  
          <td class="x_logo"></td>
          <td>
            <div
              style="background-color: #064B74; color: #FFFFFF; font-family: 'Arial Black',Gadget,sans-serif; font-size: 50px; text-align: right; vertical-align: text-bottom; padding-right: 20px; height: 70px; font-weight: bold;">
              SIFE</div>
          </td>
          <td class="x_logo"></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="x_tab"></td>
          <td class="x_tab">
            <p>Hola</p>
            <p>Para restablecer tu contraseña de SIFE, haz clic en el siguiente enlace:`+
      '<a href="' + url + '?access_token=' + info.accessToken.id + '">	Restablecer contraseña </a>' +
      `<p> Si no solicitaste restablecer tu contraseña, borra este mensaje.</p>
            <p>Un saludo, </p>
            <p>El equipo de SIFE.</p>
  
          </td>
          <td class="x_tab"></td>
        </tr>
        <tr>
          <td
            style="background-color: #064B74;     color: #FFFFFF;     font-family: Arial;     font-size: 12px;     font-style: normal;     text-align: justify;     padding-left: 5px;     padding-top: 5px;     padding-bottom: 5px;">
          </td>
          <td
            style="background-color: #064B74;     color: #FFFFFF;     font-family: Arial;     font-size: 12px;     font-style: normal;     text-align: justify;     padding-left: 5px;     padding-top: 5px;     padding-bottom: 5px;">
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;

    User.app.models.Email.send({
      to: info.email,
      from: senderAddress,
      subject: 'Password reset',
      html: html
    }, function (err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  //render UI page after password change
  User.afterRemote('changePassword', function (context, user, next) {
    context.res.render('response', {
      title: 'Password changed successfully',
      content: 'Please login again with new password',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });

  //render UI page after password reset
  User.afterRemote('setPassword', function (context, user, next) {
    context.res.json({ "status": "true" })
    /* context.res.render('response', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    }); */
  });
} 