import express from 'express';
import ExcelJS from 'exceljs';

import boughtTicketScheduleModel from '../models/boughtTicketModel';

const Router = express.Router();

Router.get('/getDailyReports', async (req, res) => {
  try {
    const tickets = await boughtTicketScheduleModel.find({});

    const report = {};

    tickets.forEach((ticket) => {
      const route = `${ticket.origin} - ${ticket.destination}`;
      const purchaseDate = new Date(ticket.purchaseDateTime)
        .toISOString()
        .split('T')[0];
      const { vehicleNumber } = ticket;
      const driverName = ticket.driverName || 'David';

      if (!report[route]) {
        report[route] = {};
      }

      if (!report[route][purchaseDate]) {
        report[route][purchaseDate] = {
          seats: 0,
          driverName,
          driverCarPlate: vehicleNumber || 'Unknown',
          totalCost: 0,
          purchasedTickets: [],
        };
      }

      report[route][purchaseDate].seats += 1;
      report[route][purchaseDate].totalCost += ticket.price;
      report[route][purchaseDate].purchasedTickets.push({
        ticketId: ticket.ticketId,
        userName: ticket.userName,
        price: ticket.price,
        purchaseDateTime: ticket.purchaseDateTime,
      });
    });

    const reportArray = Object.keys(report).map((route) => ({
      route,
      dates: Object.keys(report[route]).map((date) => ({
        date,
        ...report[route][date],
      })),
    }));

    return res.json(reportArray);
  } catch (error) {
    // TODO: Log error into Sentry
    return res.status(500).send('Error generating daily reports');
  }
});

Router.get('/getAllTickets', async (req, res) => {
  try {
    const tickets = await boughtTicketScheduleModel.find({});

    return res.json(tickets);
  } catch (err) {
    // TODO: Log error into Sentry
    return res.status(500).json({ error: 'Error retrieving tickets' });
  }
});

Router.get('/download', async (req, res) => {
  try {
    const tickets = await boughtTicketScheduleModel.find({});

    const report = {};

    tickets.forEach((ticket) => {
      const route = `${ticket.origin} - ${ticket.destination}`;
      const purchaseDate = new Date(ticket.purchaseDateTime)
        .toISOString()
        .split('T')[0];

      if (!report[route]) {
        report[route] = {};
      }

      if (!report[route][purchaseDate]) {
        report[route][purchaseDate] = {
          seats: 0,
          driverName: ticket.driverName || 'unknown',
          driverCarPlate: ticket.vehicleNumber || 'N/A',
          totalCost: 0,
          purchasedTickets: [],
        };
      }

      report[route][purchaseDate].seats += 1;
      report[route][purchaseDate].totalCost += ticket.price;
      report[route][purchaseDate].purchasedTickets.push({
        ticketId: ticket.ticketId,
        userName: ticket.userName,
        price: ticket.price,
        purchaseDateTime: ticket.purchaseDateTime,
      });
    });

    const reportArray = Object.keys(report).map((route) => ({
      route,
      dates: Object.keys(report[route]).map((date) => ({
        date,
        ...report[route][date],
      })),
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Report');

    worksheet.columns = [
      { header: 'Route', key: 'route', width: 25 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Driver Name', key: 'driverName', width: 20 },
      { header: 'Driver Car Plate', key: 'driverCarPlate', width: 20 },
      { header: 'Total Seats', key: 'seats', width: 15 },
      { header: 'Total Cost', key: 'totalCost', width: 15 },
      { header: 'Ticket ID', key: 'ticketId', width: 20 },
      { header: 'User Name', key: 'userName', width: 20 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Purchase Date', key: 'purchaseDateTime', width: 20 },
    ];

    reportArray.forEach((routeReport) => {
      routeReport.dates.forEach((dateReport) => {
        dateReport.purchasedTickets.forEach((ticket) => {
          worksheet.addRow({
            route: routeReport.route,
            date: dateReport.date,
            driverName: dateReport.driverName || 'David',
            driverCarPlate: dateReport.driverCarPlate,
            seats: dateReport.seats,
            totalCost: dateReport.totalCost.toFixed(2),
            ticketId: ticket.ticketId,
            userName: ticket.userName,
            price: ticket.price.toFixed(2),
            purchaseDateTime: new Date(
              ticket.purchaseDateTime
            ).toLocaleString(),
          });
        });
      });
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Daily_Report.xlsx'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    // TODO: Log error into Sentry
    return res.status(500).send('Error generating file');
  }
});

export default Router;
