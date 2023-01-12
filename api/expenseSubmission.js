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
      Category: request.body.category,
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

      const supabaseReq = fetch(
        'https://okvzazvzpoxaztttoshl.supabase.co/rest/v1/2023',
        {
          method: 'POST',
          headers: {
            apikey: `${process.env.SUPABASE_KEY}`,
            Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Expense: request.body.expense,
            Amount: request.body.amount,
            Category: request.body.category,
          }),
        }
      );

      const [sheetDBRes, supabaseRes] = await Promise.allSettled([
        sheetDBReq,
        supabaseReq,
      ]);
      if (
        sheetDBRes.status === 'fulfilled' &&
        supabaseRes.status === 'fulfilled'
      ) {
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
