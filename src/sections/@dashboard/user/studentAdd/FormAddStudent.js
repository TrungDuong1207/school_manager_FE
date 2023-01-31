import * as React from 'react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
// @mui
import {
    Stack,
    TextField,
    FormControlLabel,
    FormControl,
    RadioGroup,
    FormLabel,
    Radio,
    Button,
    Fab,
    MenuItem,
    InputLabel,
    Select
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { addStudent, getClass } from '../../../../services/userService';
// components

import { addOneStudent } from '../../../../features/students/studentSlice';
import { PreviewImage } from '../../../../components/previewImage/PriviewImage';

// ----------------------------------------------------------------------


export default function FormAddStudent() {

    const dispatch = useDispatch();
    const [classes, setClasses] = useState([])
    useEffect(() => {
        getClass().then(res => {
            setClasses(res.data)
        })
    }, [])

    const onFileChange = (files) => {
        formik.values.image = files
    }

    const formik = useFormik({
        initialValues: {
            studentName: "",
            dateOfBirth: "",
            address: "",
            gender: "",
            image: "",
            studyClassId: ""
        },
        validationSchema: Yup.object({
            studentName: Yup.string()
                .required("must be fill")
                .min(2, "too short")
                .max(30, "too long"),
            dateOfBirth: Yup.date()
                .required("must be fill"),
            address: Yup.string()
                .required("must be fill"),
            gender: Yup.string()
                .required("must be fill"),

        }),

        onSubmit: (values, { resetForm }) => {
            console.log(values)
            addStudent(values).then((res) => {
                dispatch(addOneStudent(res.data))
                toast.success("add student successfully")
            });
            resetForm();
        },
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <Stack spacing={3}>
                    <TextField
                        name="studentName"
                        value={formik.values.studentName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="name"
                        focused />
                    {formik.errors.studentName && formik.touched.studentName &&
                        (<p style={{ color: 'red' }}>{formik.errors.studentName}</p>)}
                    <TextField
                        name="dateOfBirth"
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="date"
                        label="date of birth"
                        focused />
                    {formik.errors.dateOfBirth && formik.touched.dateOfBirth &&
                        (<p style={{ color: 'red' }}>{formik.errors.dateOfBirth}</p>)}
                    <TextField
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="address"
                        focused />
                    {formik.errors.address && formik.touched.address &&
                        (<p style={{ color: 'red' }}>{formik.errors.address}</p>)}

                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>

                    <PreviewImage onFileChange={(files) => onFileChange(files)} />
                    <FormControl fullWidth>
                        <InputLabel id="demo-select-small">Class</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            name="studyClassId"
                            value={formik.values.studyClassId}
                            onChange={formik.handleChange}
                            label="Class"
                        >
                            <MenuItem value="">
                                <em>--choose class--</em>
                            </MenuItem>
                            {classes.length !== 0 && classes.map((item) =>
                                <MenuItem key={item.id} value={item.id}>{item.className}</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" >
                        Add Student
                    </LoadingButton>
                </Stack>

            </form>

        </>
    );
}
