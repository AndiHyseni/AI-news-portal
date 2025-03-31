import { Form, useField } from "formik";
import { Button, Label } from "semantic-ui-react";

export default function FileUpload(props) {
  const [field, meta] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Button color="blue" className="image-upload">
        <input type="file" {...field} {...props} />
      </Button>
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {" "}
          {meta.error}{" "}
        </Label>
      ) : null}
    </Form.Field>
  );
}
