import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import emailHelper from 'src/helpers/emailHelper';
import { User } from '../users/entities/users.entity';
import { Review } from '../reviews/entities/review.entity';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: ['.env', '.env.development.local'] });

@Injectable()
export class EmailService {
  $FRONT_URL = process.env.FRONT_URL;

  $default_pic =
    'https://res.cloudinary.com/dz6uvtewy/image/upload/v1751323435/vector-de-perfil-avatar-predeterminado-foto-usuario-medios-sociales-icono-183042379_egcdmt.webp';

  async registerEmail(to: string, name: string, id: string) {
    const html = fs
      .readFileSync('./src/modules/email/html/register.html', 'utf8')
      .replace('{{nombre}}', name)
      .replace('{{email}}', to)
      .replace('{{fecha}}', new Date().toLocaleDateString())
      .replace('{{userId}}', id)
      .replace(
        '{{loginUrl}}',
        'https://frontend-seven-flame-73.vercel.app/auth',
      );
    await emailHelper(
      to,
      'Bienvenido a Servicio Libre',
      `¡Felicidades ${name}! ¡Te has registrado exitosamente en Servicio Libre!`,
      html,
    );
  }

  async newServiceTicketEmail(
    to: string,
    name: string,
    ticket_id: string,
    user_pic: string,
    worker_id: string,
  ) {
    const html = fs
      .readFileSync('./src/modules/email/html/new-service-ticket.html', 'utf8')
      .replace('{{nombre}}', name)
      .replace('{{ticketId}}', ticket_id)
      .replace('{{fechaEnvio}}', new Date().toLocaleDateString())
      .replace('{{fotoPerfilUrl}}', user_pic)
      .replace(
        '{{seguimientoUrl}}',
        this.$FRONT_URL + '/worker-profile' + worker_id,
      );
    await emailHelper(
      to,
      'Solicitud para tu servicio recibida - Servicio Libre',
      `Hemos recibido tu solicitud ${name}, tendrás una respuesta pronto`,
      html,
    );
  }

  async newWorkerTicketEmail(
    to: string,
    name: string,
    ticket_id: string,
    user_pic: string,
  ) {
    const html = fs
      .readFileSync('./src/modules/email/html/new-ticket.html', 'utf8')
      .replace('{{nombre}}', name)
      .replace('{{ticketId}}', ticket_id)
      .replace('{{fecha}}', new Date().toLocaleDateString())
      .replace('{{fotoPerfilUrl}}', user_pic ? user_pic : this.$default_pic)
      .replace('{{dashboardUrl}}', this.$FRONT_URL + '/profile');
    await emailHelper(
      to,
      'Solicitud recibida - Servicio Libre',
      `Hemos recibido tu solicitud ${name}, tendrás una respuesta pronto`,
      html,
    );
  }

  async ticketRejectedEmail(
    to: string,
    name: string,
    user_pic: string,
    ticket_id: string,
    type: string,
  ) {
    const html = fs
      .readFileSync('./src/modules/email/html/rejected-ticket.html', 'utf8')
      .replace('{{nombre}}', name)
      .replace('{{ticketId}}', ticket_id)
      .replace('{{fechaRevision}}', new Date().toLocaleDateString())
      .replace('{{perfilUrl}}', () =>
        type === 'to-worker'
          ? this.$FRONT_URL + '/profile'
          : this.$FRONT_URL + '/landing',
      )
      .replace('{{profileImageUrl}}', user_pic ? user_pic : this.$default_pic)
      .replace(
        '{{ticketType}}',
        type === 'to-worker'
          ? 'ser prestador de servicios'
          : 'crear un servicio',
      )
      .replace(
        '{{lastMessage}}',
        type === 'to-worker'
          ? 'Gracias por mostrar tu interés en ser prestador de servicios'
          : 'Gracias por mostrar tu interés en crear un servicio',
      );
    await emailHelper(
      to,
      'Solicitud rechazada - Servicio Libre',
      `Tu solicitud ha sido rechazada por el equipo de Servicio Libre`,
      html,
    );
  }

  async acceptedTicketEmail(
    to: string,
    name: string,
    ticket_id: string,
    type: string,
    user_pic: string,
  ) {
    const html = fs
      .readFileSync('./src/modules/email/html/accepted-ticket.html', 'utf8')
      .replace('{{nombre}}', name)
      .replace('{{ticketId}}', ticket_id)
      .replace('{{fechaAprobacion}}', new Date().toLocaleDateString())
      .replace('{{userPhotoUrl}}', user_pic ? user_pic : this.$default_pic)
      .replace('{{trabajadorDashboardUrl}}', this.$FRONT_URL + '/profile')
      .replace(
        '{{ticketType}}',
        type === 'to-worker'
          ? 'ser prestador de servicios'
          : 'crear un servicio',
      )
      .replace(
        '{{firstMessage}}',
        type === 'to-worker'
          ? 'Ya puedes comenzar a ofrecer tus servicios y recibir solicitudes de clientes en nuestra plataforma.'
          : 'Tu servicio ya es visible en la plataforma y los usuarios podrán contactarte por él.',
      )
      .replace(
        '{{lastMessage}}',
        type === 'to-worker'
          ? '¡Bienvenido al equipo de prestadores de servicios de Servicio Libre!'
          : '¡Felicidades por haber creado satisfactoriamente un servicio!',
      );
    await emailHelper(
      to,
      'Solicitud aceptada - Servicio Libre',
      `Tu solicitud ha sido aceptada por el equipo de Servicio Libre`,
      html,
    );
  }

  async receivedReviewEmail(
    worker: User,
    user: User,
    review: Review,
    date: Date,
  ) {
    function generarEstrellas(rating: number) {
      const estrellasLlenas = '★'.repeat(rating);
      const estrellasVacias = '☆'.repeat(5 - rating);
      return estrellasLlenas + estrellasVacias;
    }

    function replaceAll(template: string, search: string, value: string) {
      return template.replace(new RegExp(search, 'g'), value);
    }

    let html = fs.readFileSync(
      './src/modules/email/html/received-review.html',
      'utf8',
    );

    html = replaceAll(
      html,
      '{{fotoTrabajador}}',
      worker.user_pic ? worker.user_pic : this.$default_pic,
    );
    html = replaceAll(html, '{{nombreTrabajador}}', worker.name || '');
    html = replaceAll(html, '{{nombreUsuario}}', user.name || '');
    html = replaceAll(
      html,
      '{{fotoUsuario}}',
      user.user_pic || this.$default_pic,
    );
    html = replaceAll(html, '{{rating}}', String(review.rate));
    html = replaceAll(html, '{{estrellas}}', generarEstrellas(review.rate));
    html = replaceAll(html, '{{comentario}}', review.description || '');
    html = replaceAll(html, '{{fechaResena}}', date.toLocaleDateString());
    html = replaceAll(
      html,
      '{{perfilUrl}}',
      this.$FRONT_URL + '/worker-profile/' + worker.id,
    );

    await emailHelper(
      worker.email,
      'Reseña recibida - Servicio Libre',
      'Has recibido una reseña de un usuario',
      html,
    );
  }
}
