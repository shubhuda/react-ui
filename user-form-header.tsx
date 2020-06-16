import Permissions from 'components/permissions';
import { isAccount } from 'helpers/type-guards';
import {
  Buttons,
  EditPencilButton,
  Fonts,
  FramelessButton,
  Tooltip,
} from 'hss_components';
import { getSelectedAccountOrFacility } from 'modules/entities/selectors/accounts.selectors';
import { ConnectedPDPCustomFieldsHeader } from 'modules/pdp-custom-fields/components/pdp-custom-fields-header/pdp-custom-fields-header';
import { ConnectedMultipleAccountsSection } from 'modules/pdp-custom-fields/components/pdp-custom-fields-header/pdp-custom-fields-multi-accounts-section';
import { SingleAccountsSection } from 'modules/pdp-custom-fields/components/pdp-custom-fields-header/pdp-custom-fields-single-account section';
import { setAbcProdCustomFieldsEditMode } from 'modules/product-details/custom-fields/act.abc-custom-fields';
import { confirmCancelAbcCustomFieldChanges } from 'modules/product-details/custom-fields/thunk.abc-custom-fields';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IAccount from 'types/account';
import { IDispatchProp } from 'types/dispatch-prop';
import IFacility from 'types/facility';
import IGlobalState from 'types/global-state';
import { IPermissionActions, Permission } from 'types/permissions';
import IDefaultProps from 'types/styled-component-props';

interface IStateProps extends IDefaultProps {
  /** Tells account information associated to the product */
  account: IAccount | IFacility;
  /** Whether edit mode of product custom fields On */
  isEditMode: boolean;
}
interface IOwnProps extends IDefaultProps {
  /** [required] React-Final-form reset Fields */
  reset: () => void;
  /** [required] React-Final-form pristine state */
  pristine: boolean;
  /** [required] React-Final-form invalid state - which will change on validation */
  invalid: boolean;
}
type IProps = IOwnProps & IStateProps & IDispatchProp;

const HeaderAccountsSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledEditButton = styled(EditPencilButton)`
  width: 19px;
  height: 19px;
  overflow: visible;
  padding: 6px;
  margin: 0 35px 0 auto;
`;

const CancelButton = styled(FramelessButton)`
  min-width: 137px;
  margin-left: auto;
`;
const CancelFont = Fonts.makeBold(Fonts.Body14);

const Header: React.SFC<IProps> = props => {
  const isMultiAccsFacility =
    !isAccount(props.account) && props.account.b2b2UnitIdList.length > 1;
  const multiAccountDetails =
    !isAccount(props.account) && props.account.b2b2UnitIdList;
  const singleAccDetails = isAccount(props.account)
    ? props.account
    : props.account.b2b2UnitIdList[0];
  return (
    <ConnectedPDPCustomFieldsHeader>
      <HeaderAccountsSection>
        {isMultiAccsFacility ? (
          <ConnectedMultipleAccountsSection
            accounts={multiAccountDetails}
            isFormEditing={!props.pristine}
          />
        ) : (
          <SingleAccountsSection account={singleAccDetails} />
        )}
      </HeaderAccountsSection>

      {props.isEditMode ? (
        <>
          <CancelButton
            type="button"
            onClick={() =>
              props.dispatch(confirmCancelAbcCustomFieldChanges(props.reset))
            }
            data-auto-id="product-details-custom-fields-cancel"
          >
            <CancelFont>Cancel</CancelFont>
          </CancelButton>
          <Buttons.Primary
            onClick={() => null}
            type="submit"
            data-auto-id="product-details-custom-fields-submit"
            disabled={props.pristine || props.invalid}
          >
            Save
          </Buttons.Primary>
        </>
      ) : (
        <Permissions hasPermissions={[Permission.CUSTOM_FIELDS_MAINTENANCE]}>
          {({
            [Permission.CUSTOM_FIELDS_MAINTENANCE]: { enabled },
          }: IPermissionActions) =>
            enabled && (
              <>
                <StyledEditButton
                  border={true}
                  data-tip
                  data-for={`abc-pdp-custom-fields-edit-tool-tip`}
                  data-auto-id="product-details-custom-fields-edit"
                  onClick={() =>
                    props.dispatch(setAbcProdCustomFieldsEditMode(true))
                  }
                />
                <Tooltip.TooltipRegular
                  id={`abc-pdp-custom-fields-edit-tool-tip`}
                  offset={{ top: 10 }}
                  className="showOnHover"
                >
                  <Fonts.Body12>{'Edit Custom Fields'}</Fonts.Body12>
                </Tooltip.TooltipRegular>
              </>
            )
          }
        </Permissions>
      )}
    </ConnectedPDPCustomFieldsHeader>
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => ({
  account: getSelectedAccountOrFacility(state),
  isEditMode: state.productDetails.customFields.isEditMode,
});

/** Connected Product Details Custom Fields Form Header */
export const ConnectedHeader = connect<IStateProps>(mapStateToProps)(Header);
