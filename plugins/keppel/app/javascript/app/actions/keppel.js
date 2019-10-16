import { ajaxHelper } from 'ajax_helper';
import { addError } from 'lib/flashes';
import { ErrorsList } from 'lib/elektra-form/components/errors_list';

import * as constants from '../constants';

const errorMessage = (error) => (
  error.response && error.response.data || error.message
);

const showError = (error) => (
  addError(React.createElement(ErrorsList, {
    errors: errorMessage(error),
  }))
);

export const fetchAccounts = () => dispatch => {
  dispatch({
    type: constants.REQUEST_ACCOUNTS,
    requestedAt: Date.now(),
  });

  return ajaxHelper.get('/keppel/v1/accounts')
    .then(response => {
      dispatch({
        type: constants.RECEIVE_ACCOUNTS,
        data: response.data.accounts,
        receivedAt: Date.now(),
      });
    })
    .catch(error => {
      dispatch({ type: constants.REQUEST_ACCOUNTS_FAILURE });
      showError(error);
    });
};

export const fetchAccountsIfNeeded = () => (dispatch, getState) => {
  const state = getState().keppel.accounts;
  if (state.isFetching || state.requestedAt) {
    return;
  }
  return dispatch(fetchAccounts());
};

export const putAccount = account => dispatch => {
  //request body contains account minus name
  const { name, auth_tenant_id, rbac_policies } = account;
  const requestBody = { account: { auth_tenant_id, rbac_policies } };

  return new Promise((resolve, reject) =>
    ajaxHelper.put(`/keppel/v1/accounts/${name}`, requestBody)
      .then(response => {
        const newAccount = response.data.account;
        dispatch({
          type: constants.UPDATE_ACCOUNT,
          account: newAccount,
        });
        resolve(newAccount);
      })
      .catch(error => reject({ errors: errorMessage(error) }))
  );
};
