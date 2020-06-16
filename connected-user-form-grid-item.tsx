import { TextInputField } from 'components/form-fields/text-input';
import { Fonts, Tooltip } from 'hss_components';
import {
  getCustomFieldValueForReadOnlyMode,
  getMaxLength,
  validate,
} from 'modules/pdp-custom-fields/helpers';
import React from 'react';
import styled from 'styled-components';
import { IProductCustomFields } from 'types/product-custom-fields';
import IDefaultProps from 'types/styled-component-props';

interface IOwnProps extends IDefaultProps {
  /** [required] Each Grid Item data of custom field form  */
  data: IProductCustomFields;
  /** [required] Each Grid Item Sequence Number of Custom Field form  */
  gridItemNumber: number;
  /** [required] Whether edit mode of product custom fields On */
  isEditMode: boolean;
  /** [required] To force tabbing horizontally on vertically rendered elements */
  tabIndex?: number;
}

interface IStyledProps {
  /** Whether edit mode of product custom fields On */
  isEditMode?: boolean;
}
type IProps = IOwnProps & IStyledProps;

const CustomFieldInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  height: ${(props: IStyledProps) => (props.isEditMode ? '60px' : '15px')};
  margin-right: ${(props: IStyledProps) => (props.isEditMode ? 'inherit' : '148px')};
  div[class*='__FieldWrapper'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 32px 0 0;
    input {
      width: 169px;
      border: 1px solid ${props => props.theme.colors.borderGrey};
    }
  }
  div[class*='__ErrorText'] {
    color: ${props => props.theme.colors.grey4};
  }
`;
const CustomFieldLabel = styled(Fonts.Body12)`
  width: ${(props: IStyledProps) => (props.isEditMode ? '158px' : 'inherit')};
  color: ${props => props.theme.colors.grey5};
`;
const StyledColon = styled(Fonts.Body12)`
  margin: 0 12px 0 3px;
  color: ${props => props.theme.colors.grey5};
`;

/** Grid Item for custom Fields form for Product */
export const CustomFieldGridItem: React.SFC<IProps> = props => {
  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  };
  const customFieldValueForReadOnlyMode =
    props.data.customFieldValue === '-' || !props.data.customFieldValue
      ? '-'
      : getCustomFieldValueForReadOnlyMode(
          props.data.customFieldType,
          props.data.customFieldValue,
        );
  const getLongLabelTextTooltip = (
    <Tooltip.TooltipForLongData
      dataDetails={
        props.data.customFieldName || `Custom Field ${props.gridItemNumber + 1}`
      }
      tooltipId={`custom-field-label-${props.gridItemNumber}`}
      maxCharLength={20}
      tailLocation={'center'}
      tooltipOffset={{ top: 0, left: 0 }}
    />
  );
  return props.isEditMode ? (
    <CustomFieldInputWrapper isEditMode={props.isEditMode}>
      <CustomFieldLabel isEditMode={props.isEditMode}>
        {getLongLabelTextTooltip}
      </CustomFieldLabel>
      <TextInputField
        id={`productCustomFieldValues.productCustomFieldValues[${props.gridItemNumber}].customFieldValue`}
        placeholder="Enter Value Here"
        key={`product-custom-field-${props.data.customFieldSequence}`}
        validate={validate(props.data.customFieldType)}
        maxLength={getMaxLength(props.data.customFieldType)}
        disabled={!props.data.customFieldName}
        onEnterKeyPress={e => onEnter(e)}
        tabIndex={props.tabIndex}
      />
    </CustomFieldInputWrapper>
  ) : (
    <CustomFieldInputWrapper isEditMode={props.isEditMode}>
      <CustomFieldLabel isEditMode={props.isEditMode}>
        {getLongLabelTextTooltip}
      </CustomFieldLabel>
      <StyledColon>:</StyledColon>
      <Fonts.Body14>{customFieldValueForReadOnlyMode}</Fonts.Body14>
    </CustomFieldInputWrapper>
  );
};
