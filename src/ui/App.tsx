import { FormEventHandler, Fragment, useCallback, useEffect, useRef, useState } from 'react';

import Expectation from './Expectation';

const App = () => {
  const [invalid, setInvalid] = useState<boolean>(false);
  const [value, setValue] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const textBoxRef = useRef<HTMLInputElement | null>(null);

  const setTextBoxInvalidRef = useRef<typeof setInvalid | undefined>(setInvalid);

  setTextBoxInvalidRef.current = setInvalid;

  useEffect(
    () => () => {
      // This effectively disabled the `setTimeout` code below.
      setTextBoxInvalidRef.current = undefined;
    },
    [setTextBoxInvalidRef]
  );

  const handleTextBoxInput = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => setValue(value),
    [setValue]
  );

  const handleSubmit = useCallback<FormEventHandler>(
    event => {
      event.preventDefault();

      // We set "novalidate=true" on the <form>, thus, we need to manually check validity.
      if (formRef.current?.checkValidity()) {
        // Domain-specific: after sending a chat message, we should clear the text box.
        setValue('');

        // Domain-specific: after sending a chat message, we should focus back to the text box.
        textBoxRef.current?.focus?.();
      }
    },
    [setTextBoxInvalidRef, setValue, textBoxRef]
  );

  const handleTextBoxInvalid = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget }) => {
      // Focus on the text box when it is invalid.
      currentTarget.focus();

      // Gem: we show the error message shortly after we set the focus.
      setTimeout(() => setTextBoxInvalidRef.current?.(true), 100);
      // Gem: we hide the error message after we show it, so it hidden to CAPSLOCK + DOWN.
      setTimeout(() => setTextBoxInvalidRef.current?.(false), 600);
    },
    [setTextBoxInvalidRef]
  );

  return (
    <Fragment>
      <h1>Focus and alert on invalid form controls</h1>
      <p>When validation failed, focus on the erroneous form control and read its error message.</p>
      <p>This repo shows how to focus and alert when the user is submitting a form with invalid form controls.</p>
      <p>
        To hide browser-native error tooltip, the form has <code>novalidate="true"</code> intentionally set. This prevent the
        browser-native tooltip to show up as it cannot be styled by any means.
      </p>
      <div className="playground">
        <form noValidate={true} onSubmit={handleSubmit} ref={formRef}>
          <input
            aria-errormessage={invalid ? 'id__error-message' : undefined}
            aria-invalid={!!invalid}
            autoFocus={true}
            className="form-input"
            onInput={handleTextBoxInput}
            onInvalid={handleTextBoxInvalid}
            placeholder="Type a message"
            ref={textBoxRef}
            required={true}
            type="text"
            value={value}
          />
          <input className="form-submit" type="submit" value="Send" />
          <br />
          <div className="error-message" id="id__error-message" role="alert">
            {invalid ? 'Cannot send empty message' : ''}
          </div>
        </form>
      </div>
      <p>Test cases:</p>
      <ul>
        <li>
          With empty text box:
          <ul>
            <li>
              Focus on text box, press <kbd>ENTER</kbd>.
              <ul>
                <li>
                  <Expectation>Screen reader should narrate "Cannot send empty message".</Expectation>
                </li>
                <li>
                  <Expectation>Screen reader should NOT narrate "type a message", "edit", and "required".</Expectation>
                  <ul>
                    <li>
                      This is because the focus is already on the text box. Screen reader should not narrate the focus
                      if it is the same.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Focus on text box, press <kbd>ENTER</kbd> multiple times.
              <ul>
                <li>
                  <Expectation>Screen reader should narrate "Cannot send empty message" repetitively.</Expectation>
                </li>
                <li>
                  <Expectation>Screen reader should NOT narrate "type a message", "edit", and "required".</Expectation>
                  <ul>
                    <li>
                      This is because the focus is already on the text box. Screen reader should not narrate the focus
                      if it is the same.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Focus on "Send" button, press <kbd>ENTER</kbd>.
              <ul>
                <li>
                  <Expectation>Screen reader should narrate "Cannot send empty message".</Expectation>
                </li>
                <li>
                  <Expectation>Focus should be on the text box.</Expectation>
                  <ul>
                    <li>When form submission failed validation, it should focus on the first invalid field.</li>
                  </ul>
                </li>
                <li>
                  <Expectation>
                    Screen reader should narrate "type a message", "edit", and "required" to indicate focus changed to the text box.
                  </Expectation>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          Type "123" into the text box:
          <ul>
            <li>
              Focus on the text box, then press <kbd>ENTER</kbd>.
              <ul>
                <li>
                  <Expectation>Screen reader should narrate nothing.</Expectation>
                </li>
              </ul>
            </li>
            <li>
              Click the "Send" button".
              <ul>
                <li>
                  <Expectation>Focus should be on the text box.</Expectation>
                  <ul>
                    <li>
                      Domain-specific: after sending a message, focus back on the text box so the user can send another
                      message as soon as possible.
                    </li>
                  </ul>
                </li>
                <li>
                  <Expectation>
                    Screen reader should narrate "type a message", "edit", and "required" to indicate focus changed to the text box.
                  </Expectation>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </Fragment>
  );
};

export default App;
