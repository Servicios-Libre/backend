import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import emailHelper from 'src/helpers/emailHelper';

@Injectable()
export class EmailService {
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

  async newTicketEmail(
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
      .replace('{{fotoPerfilUrl}}', user_pic)
      .replace(
        '{{dashboardUrl}}',
        'https://frontend-seven-flame-73.vercel.app/profile',
      );
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
      .replace(
        '{{perfilUrl}}',
        'https://frontend-seven-flame-73.vercel.app/profile',
      )
      .replace('{{profileImageUrl}}', user_pic)
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
      .replace('{{userPhotoUrl}}', user_pic)
      .replace(
        '{{trabajadorDashboardUrl}}',
        'https://frontend-seven-flame-73.vercel.app/profile',
      )
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
}
