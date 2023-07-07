import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createYoutubeChannel } from 'apiSdk/youtube-channels';
import { Error } from 'components/error';
import { youtubeChannelValidationSchema } from 'validationSchema/youtube-channels';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { YoutubeChannelInterface } from 'interfaces/youtube-channel';

function YoutubeChannelCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: YoutubeChannelInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createYoutubeChannel(values);
      resetForm();
      router.push('/youtube-channels');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<YoutubeChannelInterface>({
    initialValues: {
      channel_name: '',
      views: 0,
      earnings: 0,
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: youtubeChannelValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Youtube Channel
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="channel_name" mb="4" isInvalid={!!formik.errors?.channel_name}>
            <FormLabel>Channel Name</FormLabel>
            <Input type="text" name="channel_name" value={formik.values?.channel_name} onChange={formik.handleChange} />
            {formik.errors.channel_name && <FormErrorMessage>{formik.errors?.channel_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="views" mb="4" isInvalid={!!formik.errors?.views}>
            <FormLabel>Views</FormLabel>
            <NumberInput
              name="views"
              value={formik.values?.views}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('views', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.views && <FormErrorMessage>{formik.errors?.views}</FormErrorMessage>}
          </FormControl>
          <FormControl id="earnings" mb="4" isInvalid={!!formik.errors?.earnings}>
            <FormLabel>Earnings</FormLabel>
            <NumberInput
              name="earnings"
              value={formik.values?.earnings}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('earnings', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.earnings && <FormErrorMessage>{formik.errors?.earnings}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'youtube_channel',
    operation: AccessOperationEnum.CREATE,
  }),
)(YoutubeChannelCreatePage);
