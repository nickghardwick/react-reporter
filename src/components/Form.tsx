import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';

const Form = () => {
  const form = useForm({
    initialValues: {
      expense: '',
      amount: '',
      category: '',
    },

    transformValues: (values: any) => ({
      expense: values.expense.trim(),
      amount: Number(values.amount) || 0,
      category: values.category.trim(),
    }),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    const res = await fetch('/api/expenseSubmission', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expense: values.expense,
        amount: values.amount,
        category: values.category,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      form.reset();
      setIsLoading(false);
      showNotification({
        title: 'Success',
        message: 'Expense submitted!',
        color: 'green',
      });
      console.log(data);
    } else {
      setIsLoading(false);
      showNotification({
        title: 'Error',
        message: 'Unexpected error occurred',
        color: 'red',
      });
      console.log(data);
    }
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx='auto' mt='xl'>
      <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))}>
        <TextInput
          required
          label='Expense'
          placeholder='Your answer'
          {...form.getInputProps('expense')}
        />

        <TextInput
          required
          label='Amount'
          placeholder='Your answer'
          {...form.getInputProps('amount')}
        />

        <Select
          searchable
          required
          label='Category'
          placeholder='Choose'
          data={[
            'Coffee',
            'Eating Out',
            'Flights',
            'Gas',
            'Groceries',
            'Hotels',
            'Transportation',
            'Utilities',
            'Misc.',
          ]}
          {...form.getInputProps('category')}
        />

        <Group position='left' mt='md'>
          <Button color='green' loading={isLoading} type='submit'>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Form;
