//COMPONENTS
import Account from "./containers/account"
import AccountSearch from "./containers/accountSearch"
import Firesides from "./containers/firesides"
import Host from "./containers/host"
import Messenger from "./containers/messenger"
import UserPageContainer from "./containers/userpage"

import React from 'react'
import { Switch, Route } from 'react-router'

export default function Router (){
    return(
        <Switch>
            {/* CORE COMPONENTS */}
            <Route path="/dashboard/account"> 
               <Account></Account>
            </Route>
            <Route path="/dashboard/accountsearch"> 
               <AccountSearch></AccountSearch>
            </Route>
            <Route path="/dashboard/firesides"> 
               <Firesides></Firesides>
            </Route>
            <Route path="/dashboard/host"> 
               <Host></Host>
            </Route>
            <Route path="/dashboard/messenger"> 
               <Messenger></Messenger>
            </Route>
            <Route path="/dashboard/user/:id"> 
               <UserPageContainer></UserPageContainer>
            </Route>
        </Switch>
    )
}

