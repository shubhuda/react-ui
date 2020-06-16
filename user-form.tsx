import setFieldData from 'final-form-set-field-data';
import { ConnectedPDPCustomFieldsForm } from 'modules/pdp-custom-fields/components/pdp-custom-fields-form';
import { setCustomFieldsFormTouchedState } from 'modules/product-details/custom-fields/act.abc-custom-fields';
import { ConnectedHeader } from 'modules/product-details/custom-fields/components/abc-custom-fields-header';
import {
  editAbcProductCustomFields,
  fetchAbcProductCustomFields,
} from 'modules/product-details/custom-fields/thunk.abc-custom-fields';
import React, { useEffect } from 'react';
import { Form } from 'react-final-form';
import { connect } from 'react-redux';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IProductCustomFields } from 'types/product-custom-fields';
import IDefaultProps from 'types/styled-component-props';
interface IStateProps extends IDefaultProps {
  /** [required] Data for ABC product custom fields */
  customFields: {
    productCustomFieldValues: { productCustomFieldValues: IProductCustomFields[] };
  };
  /** [required] Whether edit mode of product custom fields On */
  isEditMode: boolean;
}

type IProps = IDispatchProp & IStateProps;

const abcCustomFieldsComponent: React.SFC<IProps> = ({ dispatch, ...props }) => {
  useEffect(() => {
    dispatch(fetchAbcProductCustomFields());
  }, []);

  const onSubmit = (values: any) => {
    dispatch(editAbcProductCustomFields({ ...values }));
  };
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ ...props.customFields }}
      mutators={{ setFieldData }}
      render={({ handleSubmit, form, submitting, pristine, values, invalid }) => {
        dispatch(setCustomFieldsFormTouchedState(pristine));
        return (
          <form
            onSubmit={handleSubmit}
            id="abcProductCustomFields"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            <ConnectedHeader
              reset={form.reset}
              pristine={pristine}
              invalid={invalid}
            />
            {!!props.customFields.productCustomFieldValues.productCustomFieldValues
              .length && (
              <ConnectedPDPCustomFieldsForm
                customFields={props.customFields.productCustomFieldValues}
                isEditMode={props.isEditMode}
                pristine={pristine}
              />
            )}
          </form>
        );
      }}
    />
  );
};
const mapStateToProps = (state: IGlobalState): IStateProps => ({
  customFields: state.productDetails.customFields.data,
  isEditMode: state.productDetails.customFields.isEditMode,
});
/** Product Details Custom Fields Form Container Component */
export const ConnectedAbcCustomFieldsComponent = connect<IStateProps>(
  mapStateToProps,
)(abcCustomFieldsComponent);
