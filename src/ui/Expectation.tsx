import { FormEventHandler, Fragment, useCallback, useState } from 'react';
import classNames from 'classnames';

import type { PropsWithChildren } from 'react';

const Expectation = ({ children }: PropsWithChildren<{}>) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleInput = useCallback<FormEventHandler<HTMLInputElement>>(() => {
    setChecked(checked => !checked);
  }, [setChecked]);

  return (
    <Fragment>
      <label className={classNames('expectation', { 'expectation--checked': checked })}>
        <input checked={checked} className="expectation__checkbox" onInput={handleInput} type="checkbox" />
        <span className="expectation__body">
          <span className="expectation__badge">EXPECT</span> {children}
        </span>
      </label>
    </Fragment>
  );
};

export default Expectation;
