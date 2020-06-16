import { disableDataLoss } from 'modules/data-loss/act.data-loss';
import { CustomFieldGridItem } from 'modules/pdp-custom-fields/components/pdp-custom-fields-form-gridItem';
import { handleDataLoss } from 'modules/product-details/custom-fields/thunk.abc-custom-fields';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import { IProductCustomFields } from 'types/product-custom-fields';
import IDefaultProps from 'types/styled-component-props';

interface IOwnProps {
  /** [required] twelve custom fields data to render input component */
  customFields: { productCustomFieldValues: IProductCustomFields[] };
  /** [required] Whether edit mode of product custom fields On */
  isEditMode: boolean;
  /** [required] React-Final-form pristine state */
  pristine?: boolean;
}
type IProps = IDefaultProps & IOwnProps & IDispatchProp;

const CustomFieldContainer = styled.div`
  display: flex;
  width: 100%;
`;
const CustomFieldColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const PDPCustomFieldsForm: React.SFC<IProps> = ({
  customFields,
  pristine,
  ...props
}) => {
  useEffect(() => {
    pristine ? props.dispatch(disableDataLoss()) : props.dispatch(handleDataLoss());
  }, [pristine]);

  const customFieldsSortedData =
    !!customFields.productCustomFieldValues.length &&
    customFields.productCustomFieldValues.sort(
      (a: IProductCustomFields, b: IProductCustomFields) => {
        return a.customFieldSequence - b.customFieldSequence;
      },
    );
  const customFieldColumnsArray = []; // Need 3 columns so Need array with 3 subArrays
  const rowCount = 4;
  for (let x = 0; x < customFieldsSortedData.length; x += rowCount) {
    customFieldColumnsArray.push(customFieldsSortedData.slice(x, x + rowCount));
  }
  return (
    <CustomFieldContainer>
      <>
        <CustomFieldColumn>
          {customFieldColumnsArray[0].map(
            (eachRowItem: IProductCustomFields, index: number) => (
              <CustomFieldGridItem
                data={eachRowItem}
                gridItemNumber={index}
                key={eachRowItem.customFieldSequence}
                isEditMode={props.isEditMode}
                tabIndex={index + 1}
              />
            ),
          )}
        </CustomFieldColumn>
        <CustomFieldColumn>
          {customFieldColumnsArray[1].map(
            (eachRowItem: IProductCustomFields, index: number) => (
              <CustomFieldGridItem
                data={eachRowItem}
                gridItemNumber={index + 4}
                key={eachRowItem.customFieldSequence}
                isEditMode={props.isEditMode}
                tabIndex={index + 1}
              />
            ),
          )}
        </CustomFieldColumn>
        <CustomFieldColumn>
          {customFieldColumnsArray[2].map(
            (eachRowItem: IProductCustomFields, index: number) => (
              <CustomFieldGridItem
                data={eachRowItem}
                gridItemNumber={index + 8}
                key={eachRowItem.customFieldSequence}
                isEditMode={props.isEditMode}
                tabIndex={index + 1}
              />
            ),
          )}
        </CustomFieldColumn>
      </>
    </CustomFieldContainer>
  );
};
/** Connected Product Details Custom Fields Form  */
export const ConnectedPDPCustomFieldsForm = connect<{}>(null)(PDPCustomFieldsForm);
