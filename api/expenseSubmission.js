import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(timezone);
dayjs.extend(utc);

export default async (request, response) => {
  if (request.method === 'POST') {
    const expenseData = {
      Timestamp: dayjs()
        .tz('America/Los_Angeles')
        .format('MM/DD/YYYYTHH:mm:ss'),
      Expense: request.body.expense,
      Amount: request.body.amount,
      Category: request.body.category === '' ? 'Coffee' : request.body.category,
    };

    try {
      const sheetDBReq = fetch(`${process.env.SHEETDB_URL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [expenseData],
          sheet: 'Ledger',
        }),
      });

      const [sheetDBRes] = await Promise.allSettled([sheetDBReq]);
      if (sheetDBRes.status === 'fulfilled') {
        const data = await sheetDBRes.value.json();
        response.status(201).json(data);
      } else {
        const data = await sheetDBRes.value.json();
        response.status(400).json(data);
      }
    } catch (err) {
      response.status(400).json(err);
    }
  }
};
