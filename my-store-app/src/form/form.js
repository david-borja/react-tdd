import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

export const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    // here we extract input fields by id. It returns nodes. DON'T REALLY UNDERSTAND WHAT E.TARGET.ELEMENTS IS RETURNING AND I CAN'T CONSOLE.LOG!
    const {name, size, type} = e.target.elements

    validateForm({name, size, type})

    // Warning: when react is asked to update the state repeatedly one line after the other, it only runs the last one for performance optimization. But we want to force react to update each time, and wait for the update to be compleated to keep running

    await fetch('/products', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    setIsSubmitting(false)
  }

  const handleBlur = e => {
    // here the instructor extracted the attribute name, which I think was a bit missleading because that was also the name of the name input
    const {id, value} = e.target
    validateField({field: id, value})
  }

  return (
    <>
      <h1>Create product</h1>
      <form onSubmit={handleSubmit}>
        {/* due to using material-ui, we need to add an id name to the TextField input field so the react-testing-library can refer to it when using getByLabelText. Here using material-ui, the label attribute just allows to show something for the user next to an input field  */}
        <TextField
          label="name"
          id="name"
          // name="name"
          helperText={formErrors.name}
          onBlur={handleBlur}
        />
        <TextField
          label="size"
          id="size"
          helperText={formErrors.size}
          // name="size"
          onBlur={handleBlur}
        />

        <InputLabel htmlFor="type">Type</InputLabel>

        <Select
          native
          value=""
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
        {/* the instructor first writes formErrors.type.length, but it seems that in a later version of his code he writes it like me */}
        {formErrors.type && <p>{formErrors.type}</p>}

        {/* for the should display validation messages test to pass, the button needs this type="submit" */}
        <Button disabled={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </>
  )
}

export default Form
