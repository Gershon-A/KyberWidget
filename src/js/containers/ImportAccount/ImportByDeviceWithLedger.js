import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Ledger } from "../../services/keys"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import constants from '../../services/constants';

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    screen: props.screen
  }
})
export default class ImportByDeviceWithLedger extends React.Component {
  deviceService = new Ledger()

  render = () => {
    return(
      <ImportByDevice
        type={constants.IMPORT_ACCOUNT_TYPE.ledger}
        deviceService={this.deviceService}
        screen={this.props.screen}
      />
    )
  }
}
