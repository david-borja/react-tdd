import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import {saveProduct} from '../services/productServices'
import {
  CREATED_STATUS,
  ERROR_SERVER_STATUS,
  INVALID_REQUEST_STATUS,
} from '../consts/httpStatus'

export const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })

  const validateField = ({field, value}) => {
    setFormErrors(prevState => ({
      ...prevState,
      [field]: value.length ? '' : `The ${field} is required`,
    }))
  }

  const validateForm = ({name, size, type}) => {
    validateField({field: name.id, value: name.value})
    validateField({field: size.id, value: size.value})
    validateField({field: type.id, value: type.value})
  }

  const getFormValues = ({name, size, type}) => ({
    name: name.value,
    size: size.value,
    type: type.value,
  })

  const handleFetchErrors = async error => {
    if (error.status === ERROR_SERVER_STATUS) {
      setErrorMessage('Unexpected error, please try again')
      return
    }
    if (error.status === INVALID_REQUEST_STATUS) {
      // it returns a promise which resolves with the result of parsing the body text as json
      const data = await error.json()
      setErrorMessage(data.message)
      return
    }

    setErrorMessage('Connection error, please try later')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    // here we extract input fields by id. It returns nodes. DON'T REALLY UNDERSTAND WHAT E.TARGET.ELEMENTS IS RETURNING AND I CAN'T CONSOLE.LOG!
    const {name, size, type} = e.target.elements

    validateForm({name, size, type})

    // Warning: when react is asked to update the state repeatedly one line after the other, it only runs the last one for performance optimization. But we want to force react to update each time, and wait for the update to be compleated to keep running

    try {
      const response = await saveProduct(getFormValues({name, size, type}))
      // when using fetch, it returns a property called 'ok'. It allows our catch block to work. If we don't throw the response, it doesn't work
      if (!response.ok) {
        throw response
      }

      if (response.status === CREATED_STATUS) {
        // resets the form
        e.target.reset()
        setIsSuccess(true)
      }
    } catch (error) {
      handleFetchErrors(error)
    }

    setIsSubmitting(false)
  }

  const handleBlur = e => {
    // here the instructor extracted the attribute name, which I think was a bit missleading because that was also the name of the name input
    const {id, value} = e.target
    validateField({field: id, value})
  }

  // console.log(formErrors.type.length)

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center">
        Create product
      </Typography>

      {/* if the message to show comes from the backend, we could extract the message from response and assign it to a state variable so it renders instantly when an error message is received */}
      {isSuccess && <p>Product Stored</p>}
      {errorMessage && <p>{errorMessage}</p>}

      {/* the instructor writes it like this, but is is a bit weird to me to render an empty paragraph when we don't have an errorMessage */}
      {/* {<p>{errorMessage}</p>} */}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* due to using material-ui, we need to add an id name to the TextField input field so the react-testing-library can refer to it when using getByLabelText. Here using material-ui, the label attribute just allows to show something for the user next to an input field  */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              id="name"
              // name="name"
              helperText={formErrors.name}
              onBlur={handleBlur}
              // It works with a boolean
              error={formErrors.name.length > 0}
              // or this would also work:
              // error={!!formErrors.name}
              // But it does not work with falsy (empty string)
              // error={formErrors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Size"
              id="size"
              helperText={formErrors.size}
              // name="size"
              onBlur={handleBlur}
              error={formErrors.size.length > 0}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              fullWidth
              error={formErrors.type.length > 0}
              native
              // important to notice that if we have a value hardcoded like this, the value of this element will never change. It will always be an empty string
              // value=""
              inputProps={{
                // name: 'type',
                id: 'type',
              }}
              // helperText={formErrors.type}
            >
              <option aria-label="None" value="" />
              <option value="electronic">Electronic</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </Select>
            {/* Select component (from Material UI) doesn't come with helperText, so we have to improvise something similar in the next line  */}
            {/* the instructor first writes formErrors.type.length, but it seems that in a later version of his code he writes it like me. And the reason is because {formErrors.type.length && <p>{formErrors.type}</p>} accidentally renders a 0 */}

            {/* this way it parses the empty string to a boolean (false) */}
            {/* {!!formErrors.type && <p>{formErrors.type}</p>} */}

            {formErrors.type && <p>{formErrors.type}</p>}

            {/* for the should display validation messages test to pass, the button needs this type="submit" */}
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default Form
