import React from "react"
import { NavLink } from 'react-router-dom'
import { roundingNumber } from "../../utils/converter"
import { Link } from 'react-router-dom'
import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";

import * as converter from "../../utils/converter"

const ExchangeBodyLayout = (props) => {

  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if (check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if (check) props.input.destAmount.onChange(e)
  }



  var errorSelectSameToken = props.errors.selectSameToken !== '' ? props.translate(props.errors.selectSameToken) : ''
  var errorSelectTokenToken = props.errors.selectTokenToken !== '' ? props.translate(props.errors.selectTokenToken) : ''
  var errorToken = errorSelectSameToken + errorSelectTokenToken

  var maxCap = props.maxCap
  var errorSource = []
  var errorExchange = false
  if (props.errorNotPossessKgt !== "") {
    errorSource.push(props.errorNotPossessKgt)
    errorExchange = true
  } else {
    if (props.errors.exchange_enable !== "") {
      errorSource.push(props.translate(props.errors.exchange_enable))
      errorExchange = true
    } else {
      if (errorToken !== "") {
        errorSource.push(errorToken)
        errorExchange = true
      }
      if (props.errors.sourceAmount !== "") {
        if (props.errors.sourceAmount === "error.source_amount_too_high_cap") {
          if (props.sourceTokenSymbol === "ETH") {
            errorSource.push(props.translate("error.source_amount_too_high_cap", { cap: maxCap }))
          } else {
            errorSource.push(props.translate("error.dest_amount_too_high_cap", { cap: maxCap * constants.MAX_CAP_PERCENT }))
          }
        } else {
          errorSource.push(props.translate(props.errors.sourceAmount))
        }
        errorExchange = true
      }
      if (props.errors.rateSystem !== "") {
        errorSource.push(props.translate(props.errors.rateSystem))
        errorExchange = true
      }
    }
  }

  var errorShow = errorSource.map((value, index) => {
    return <span class="error-text" key={index}>{value}</span>
  })

  var classSource = "amount-input"
  if (props.focus === "source") {
    classSource += " focus"
  }
  if (errorExchange) {
    classSource += " error"
  }

  return  (
    <div id="exchange">
    <div className="grid-x">
      {/* <div className={errorExchange ||  props.networkError !== ""? "cell medium-6 large-3 balance-wrapper error" : "cell medium-6 large-3 balance-wrapper"} id="balance-account-wrapper">
        {props.balanceList}
      </div> */}
      <div className="cell medium-12 large-12 swap-wrapper">
        {/* <div className="grid-x">
              <div>

              </div>
            </div> */}
        {/* <div> */}
        <div className="grid-x exchange-col">
          <div className="cell large-8 exchange-col-1">
            {props.networkError !== "" && (
              <div className="network_error">
                <span>
                  <img src={require("../../../assets/img/warning.svg")} />
                </span>
                <span>
                  {props.networkError}
                </span>
                {/* <span>
                  <img src={require("../../../assets/img/loading.svg")} />
                </span> */}
              </div>
            )}

         <div className="title main-title">{props.translate("transaction.payment") || "Payment"}</div>

            {props.exchange.isHaveDestAmount && (
              <div>
                <div>You are about to pay {props.exchange.receiveAddr}: {props.exchange.destAmount} {props.exchange.destTokenSymbol}</div>
                <div>Choose youy payment method</div>
                <div>
                  <div className="cell large-5">
                    <span className="transaction-label">
                      {props.translate("transaction.exchange_from").toUpperCase() || "FROM"}
                    </span>
                    <div className={errorExchange ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenSourceSelect}

                      <div>Estimate value you should pay</div>
                      <div>
                        {converter.caculateSourceAmount(props.exchange.destAmount, props.exchange.offeredRate, 6)} {props.exchange.sourceTokenSymbol} 
                      </div>
                    </div>
                    <div className={errorExchange ? "error" : ""}>
                      {errorShow}
                    </div>
                  </div>
                </div>
              </div>
            )}

        {!props.exchange.isHaveDestAmount && (
           <div>            
              <div>You are about to pay {props.exchange.receiveAddr}</div>    
                <div>Choose your payment method</div>
                <div>
                  <div className="cell large-5">
                    <span className="transaction-label">
                      {props.translate("transaction.exchange_from").toUpperCase() || "FROM"}
                    </span>
                    <div className={errorExchange ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenSourceSelect}


                      <div className={classSource}>
                        <div>
                          <input id="inputSource" className="source-input" min="0" step="0.000001"
                            placeholder="0" autoFocus
                            type="text" maxLength="50" autoComplete="off"
                            value={props.input.sourceAmount.value}
                            onFocus={props.input.sourceAmount.onFocus}
                            onBlur={props.input.sourceAmount.onBlur}
                            onChange={handleChangeSource}
                          />
                        </div>
                        <div>
                          <span>{props.sourceTokenSymbol}</span>
                        </div>
                      </div>
                      
                    </div>
                    <div className={errorExchange ? "error" : ""}>
                      {errorShow}
                    </div>
                  </div>
                </div>
                <div>
                  Estimate dest value: {props.exchange.destAmount} {props.exchange.destTokenSymbol}
                </div>
              </div>
        )}

            
            
            <div class="checkbox">
              <input id="term-agree" type="checkbox" onChange={props.acceptedTerm}/>
              <label for="term-agree">
                I agree to <a href="https://files.kyber.network/tac.html" target="_blank">Terms &amp; Conditions</a>
              </label>
            </div>
            
            <button className={props.classNamePaymentbtn} onClick={(e) => props.importAccount(e)}>{props.translate("transaction.payment") || "Payment"}</button>
            
            
            {/* <div className="large-6">
              {props.addressBalanceLayout}
            </div> */}

            {/* <div class="address-balance large-6">
              <p class="note">{props.translate("transaction.address_balance") || "Address Balance"}</p>
              <div>
                <span>{props.translate("transaction.click_to_ex_all_balance") || "Click to swap all balance"}</span>
                <span className="balance" title={props.balance.value} onClick={() => {
                  props.setAmount()
                  setTimeout(moveCursor, 0);
                }}>
                  {props.balance.roundingValue}
                </span>
              </div>
            </div> */}
          </div>
          <div className="cell large-4 exchange-col-2">
            {props.advanceLayout}
          </div>
        </div>
        <div className="grid-x exchange-col-3">
          <div className="cell large-8">
            {/* {props.exchangeButton} */}
            
          </div>
        </div>
      </div>
    </div>
    </div>
  )
  // return (

  //   <div id="exchange">
  //     {render}
  //     {props.transactionLoadingScreen}
  //   </div>
  // )
}

export default ExchangeBodyLayout
