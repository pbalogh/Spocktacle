(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,n){e.exports=n(25)},24:function(e,t,n){},25:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"Formula",function(){return B}),n.d(a,"Not",function(){return C}),n.d(a,"Or",function(){return V}),n.d(a,"And",function(){return F}),n.d(a,"Variable",function(){return P}),n.d(a,"Parenthetical",function(){return W}),n.d(a,"Then",function(){return D}),n.d(a,"Iff",function(){return _});var i=n(0),r=n.n(i),o=n(13),s=n(6),l=n(1),c=n(2),u=n(4),h=n(3),d=n(5),f=n(8),m=n.n(f),v=n(11),g=function(e){var t=i.useState({x:0,y:0}),n=Object(v.a)(t,2),a=n[0],r=n[1],o=i.useState({x:0,y:0}),s=Object(v.a)(o,2),l=s[0],c=s[1],u=i.useState(!1),h=Object(v.a)(u,2),d=h[0],f=h[1],g={left:a.x+"px",top:a.y+"px"};return i.createElement("svg",{className:m.a.draggable,width:window.innerWidth,height:5e3,style:g,onMouseDown:function(e){c({x:e.clientX,y:e.clientY}),f(!0)},onMouseUp:function(){return f(!1)},onMouseMove:function(e){d&&(r({x:a.x+e.clientX-l.x,y:a.y+e.clientY-l.y}),c({x:e.clientX,y:e.clientY}))}},e.children)},p=n(7),b=n(9),O="red",S="green",y="black",A=300,j=22,w=60,N=20,k=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).elementref={},n.textWidth=0,n.setChildWidth=function(e,t){n.setState(function(n){var a=n.childWidths;return{childWidths:Object(p.a)({},a,Object(s.a)({},t,e))}},n.updateMyWidth)},n.updateMyWidth=function(){var e=n.state,t=e.childWidths,a=e.expanded,i=n.props,r=i.node,o=i.parent;if(o)if(a){var s=Object.values(t).reduce(function(e,t){return e+t+N},-N);o.setChildWidth(Math.max(n.textWidth,s),r.toString())}else o.setChildWidth(n.textWidth,r.toString())},n.componentDidMount=function(){var e=n.props.node;n.updateTextWidth(),n.setState({closed:e.closed})},n.updateTextWidth=function(){var e=n.state.leftOffsets;n.textWidth=0;for(var t=0,a=Object.values(n.elementref);t<a.length;t++){var i=a[t],r=i.getBBox().width;e[i.textContent]=-r/2,r>n.textWidth&&(n.textWidth=r)}n.setState({leftOffsets:e},n.updateMyWidth)},n.getColorShowingStateViolation=function(e){var t=e.getStateDelta();if(null===t)return y;for(var a=n.props.node,i=0,r=Object.keys(t);i<r.length;i++){var o=r[i];if(a.stateViolations.hasOwnProperty(o))return a.overallColor=O,O;if(a.futureStateViolations.hasOwnProperty(o))return a.overallColor===y&&(a.overallColor=S),S}return y},n.getTextForNecessity=function(e,t){var a=n.state.leftOffsets;return r.a.createElement("text",{key:e.toString(),fill:n.getColorShowingStateViolation(e),transform:"translate(".concat(a[e.toString()]||0," ").concat(t*j,")"),ref:function(t){return n.elementref[e.toString()]=t}},e.toString())},n.toggleExpanded=function(){n.setState(function(e){return{expanded:!e.expanded}},n.updateMyWidth)},n.renderNodeChildren=function(e,a,i){var o=.5*-Object.values(i).reduce(function(e,t){return e+t+N},-N),s=[],l=!0,c=!1,u=void 0;try{for(var h,d=a.children[Symbol.iterator]();!(l=(h=d.next()).done);l=!0){var f=h.value,m=i[f.toString()]||A;o+=m/2,s.push(r.a.createElement("g",{key:f.toString()},r.a.createElement("line",{x1:"0",y1:e+3,x2:o,y2:e+w-j,style:{stroke:f.overallColor,strokeWidth:2}}),r.a.createElement(t,{x:o,y:e+w,node:f,parent:Object(b.a)(n)}))),o+=m/2,o+=N}}catch(v){c=!0,u=v}finally{try{l||null==d.return||d.return()}finally{if(c)throw u}}return s},n.state={childWidths:{},closed:!1,expanded:!1,leftOffsets:{},parent:e.parent},n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.node,a=t.x,i=t.y,o=this.state,s=o.expanded,l=o.closed,c=n.necessities,u=Object.keys(c).length*j,h=Object.values(c).map(function(t,n){return e.getTextForNecessity(t,n)}),d=this.state.childWidths;return r.a.createElement("g",{transform:"translate(".concat(a," ").concat(i,")"),className:"node"},r.a.createElement("rect",{x:-5,y:u-10,width:10,height:10,style:{stroke:"black",fill:l?"black":"white"}}),h,n.children.length>0&&r.a.createElement("text",{y:u+18,x:"-5",onClick:this.toggleExpanded},"+"),s&&this.renderNodeChildren(u+21,n,d))}}]),t}(r.a.Component),T=function(){function e(t,n,a){var i=this,r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];Object(l.a)(this,e),this.necessities=t,this.parent=a,this.immediateMode=r,this.mapOfVariablesToNecessitiesThatSetThem={},this.state=void 0,this.children=void 0,this.variableThatViolatesState=void 0,this.futureStateViolations={},this.stateViolations={},this.overallColor=y,this.closed=!1,this.toString=function(){return Object.keys(i.necessities).join()},this.checkIfIAmClosed=function(){if("(A||!C),!A"===i.toString()&&(console.log("In checkIfIAmClosed for node ",i.toString()),console.log("this.children is ",i.children),console.log("this.parent is ",i.parent)),i.children.length>0){"(A||!C),!A"===i.toString()&&console.log("I do have children "),i.closed=!0;var e=!0,t=!1,n=void 0;try{for(var a,r=i.children[Symbol.iterator]();!(e=(a=r.next()).done);e=!0){var o=a.value;if("(A||!C),!A"===i.toString()&&console.log("child.closed is ",o.closed),!o.closed){console.log("NOT CLOSED: "+i.toString()),console.log("Because child "+o.toString()+" isn't closed"),i.closed=!1;break}}}catch(s){t=!0,n=s}finally{try{e||null==r.return||r.return()}finally{if(t)throw n}}}i.parent&&("(!Q->(R&&!S)),(P||Q),P&&!!Q"===i.toString()&&console.log("(!Q->(R&&!S)),(P||Q),P&&!!Q is asking my parent if it is closed"),i.parent.checkIfIAmClosed())},this.checkForStateViolation=function(e){for(var t=0,n=Object.keys(e);t<n.length;t++){var a=n[t];if(i.state.hasOwnProperty(a)){if(e[a]!==i.state[a])return i.respondToStateViolation(a),a}else i.state[a]=e[a]}return i.checkIfIAmClosed(),null},this.getNecessitiesThatDoNotDirectlyUpdateState=function(){for(var e={},t=0,n=Object.values(i.necessities);t<n.length;t++){var a=n[t],r=a.getStateDelta();if(null!==r){console.log("Found a state delta: ",r);var o=i.checkForStateViolation(r);if(o)return i.variableThatViolatesState=o,{}}else e[a.toString()]=a}return e},this.howManyNodesWideIAm=function(){return 0===i.children.length?1:i.children.reduce(function(e,t){return e+t.howManyNodesWideIAm()},0)},this.makeNewNecAndProb=function(e,t){return{necessities:e,possibilities:t}},this.getNecessityWithoutPossibilities=function(e){for(var t=0,n=Object.values(e);t<n.length;t++){var a=n[t];if(0===Object.keys(a.toBeTrue().possibilities).length)return a}return null},this.children=[],this.state=Object(p.a)({},n),r&&(console.log("About to updatestate"),this.updateStateAndGenerateChildren())}return Object(c.a)(e,[{key:"respondToStateViolation",value:function(e){console.log("STATE VIOLATION FOR variableName ",e),this.stateViolations[e]=!0,this.overallColor=O,this.closed=!0,this.checkIfIAmClosed(),this.parent&&this.parent.respondToFutureStateViolation(e)}},{key:"respondToFutureStateViolation",value:function(e){console.log("FUTURE STATE VIOLATION FOR variableName ",e),"(P<->!!Q)&&(!Q->(R&&!S)),(S->(P||Q)),(S&&Q),!P"===this.toString()&&(console.log("respondToFutureStateViolation for node ",this.toString()),console.log("this.children is ",this.children)),this.futureStateViolations[e]=!0,this.overallColor=S,this.checkIfIAmClosed(),this.parent&&this.parent.respondToFutureStateViolation(e)}},{key:"rememberWhichNecessitySetWhichVariables",value:function(e,t){for(var n=0,a=Object.keys(e);n<a.length;n++){var i=a[n];this.mapOfVariablesToNecessitiesThatSetThem[i]=t}}},{key:"updateStateAndGenerateChildren",value:function(){var t=this.getNecessitiesThatDoNotDirectlyUpdateState();if(Object.keys(t).length===Object.keys(this.necessities).length&&console.log("NO STATE DELTAS THERE"),0!==Object.keys(t).length){var n,a,i=this.getNecessityWithoutPossibilities(t);null!==i?(n=i,console.log("Found a formulaWithoutPossibilities! It's ",i)):n=Object.values(t)[0],delete t[n.toString()],a=n.toBeTrue(),console.log("newNecessitiesAndProbabilitiesForChildren are ",a),console.log("necessitiesThatDoNotDirectlyUpdateState are ",t);var r=Object(p.a)({},t,a.necessities);if(console.log("necessitiesForAllChildren are ",r),0===Object.keys(a.possibilities).length){console.log("We only need one kid");var o=new e(r,Object(p.a)({},this.state),this,!1);this.children=[o],o.updateStateAndGenerateChildren()}else{this.children=[];for(var l=0,c=Object.values(a.possibilities);l<c.length;l++){var u=c[l],h=Object(p.a)({},r,Object(s.a)({},u.toString(),u));console.log("Making a new EvaluationNode with state ",Object(p.a)({},this.state));var d=new e(h,Object(p.a)({},this.state),this,!1);this.children.push(d),d.updateStateAndGenerateChildren()}}}else console.warn("There are no more necessities left to prove and this.variableThatViolatesState is "+this.variableThatViolatesState)}}]),e}(),I="FORMULA",E=function(){function e(t,n,a){var i=this;Object(l.a)(this,e),this.elements=void 0,this.syntaxmatch=void 0,this.className=void 0,this.evaluate=function(e){return!1},this.getVarName=function(){return i.elements},this.toString=function(){return i.elements},this.elements=t,this.syntaxmatch=n,this.className=a}return Object(c.a)(e,[{key:"toBeFalse",value:function(){throw new Error("We're in the non-overridden toBeFalseFunc")}},{key:"toBeTrue",value:function(){throw new Error("We're in the non-overridden toBeTrueFunc")}},{key:"getStateDelta",value:function(){return null}}]),e}(),R=[new E("->","BINARYOPERATOR","Then"),new E("<->","BINARYOPERATOR","Iff"),new E("(","OPENPARENS","Formula"),new E(")","CLOSEPARENS","Formula"),new E("!","UNARYOPERATOR","Not"),new E("AND","BINARYOPERATOR","And"),new E("&&","BINARYOPERATOR","And"),new E("OR","BINARYOPERATOR","Or"),new E("||","BINARYOPERATOR","Or")],B=function(){function e(t,n,a){var i=this;Object(l.a)(this,e),this.elements=void 0,this.syntaxmatch=void 0,this.className=void 0,this.myString=void 0,this.evaluate=function(e){return!0},this.getVarName=function(){return null},this.toStringFunction=function(){return i.elements.reduce(function(e,t){return e+t.toString()},"")},this.toString=function(){return i.myString||(i.myString=i.toStringFunction()),i.myString},this.elements=t,this.syntaxmatch=n,this.className=a}return Object(c.a)(e,[{key:"toBeFalse",value:function(){return this.toBeFalseImplementation()}},{key:"toBeFalseImplementation",value:function(){throw new Error("We're in the non-overridden toBeFalseFunc")}},{key:"toBeTrue",value:function(){return this.toBeTrueImplementation()}},{key:"toBeTrueImplementation",value:function(){throw new Error("We're in the non-overridden toBeFalseFunc")}},{key:"getStateDelta",value:function(){return null}}]),e}(),C=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,I,"Not"))).toBeFalseImplementation=function(){return i.elements[1].toBeTrue()},i.evaluate=function(e){return!i.elements[1].evaluate(e)},i.toBeTrueImplementation=function(){return i.elements[1].toBeFalse()},i}return Object(d.a)(t,e),Object(c.a)(t,null,[{key:"wrapInNot",value:function(e){return new t([t.NotToken,e],I,"Not")}}]),Object(c.a)(t,[{key:"getStateDelta",value:function(){var e=this.elements[1].getStateDelta();if(e)for(var t=0,n=Object.keys(e);t<n.length;t++){var a=n[t];e[a]=!e[a]}return e}}]),t}(B);C.NotToken=new E("!","UNARYOPERATOR","Not");var x=n(10),V=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,I,"Or"))).evaluate=function(e){return i.elements[0].evaluate(e)||i.elements[2].evaluate(e)},i.toBeFalseImplementation=function(){var e={},t=C.wrapInNot(i.elements[0]),n=C.wrapInNot(i.elements[2]);return e[t.toString()]=t,e[n.toString()]=n,{necessities:e,possibilities:{}}},i.toBeTrueImplementation=function(){var e={};return e[i.elements[0].toString()]=i.elements[0],e[i.elements[2].toString()]=i.elements[2],{necessities:{},possibilities:e}},i}return Object(d.a)(t,e),Object(c.a)(t,null,[{key:"wrapInOr",value:function(e,n){return new t([e,t.OrToken,n],I,"Or")}}]),t}(B);V.OrToken=new E("||","BINARYOPERATOR","Or");var F=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,I,"And"))).evaluate=function(e){return i.elements[0].evaluate(e)&&i.elements[2].evaluate(e)},i.toBeFalseImplementation=function(){var e={},t=C.wrapInNot(i.elements[0]),n=C.wrapInNot(i.elements[2]);return e[t.toString()]=t,e[n.toString()]=n,{necessities:{},possibilities:e}},i.toBeTrueImplementation=function(){var e={};return e[i.elements[0].toString()]=i.elements[0],e[i.elements[2].toString()]=i.elements[2],{necessities:e,possibilities:{}}},i}return Object(d.a)(t,e),Object(c.a)(t,null,[{key:"wrapInAnd",value:function(e,n){return new t([e,t.AndToken,n],I,"And")}}]),t}(B);F.AndToken=new E("&&","BINARYOPERATOR","And");var P=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,n,"Variable"))).getVarName=function(){return i.elements[0].getVarName()},i.toBeFalseImplementation=function(){var e=C.wrapInNot(Object(b.a)(i));return{necessities:Object(s.a)({},e.toString(),e),possibilities:{}}},i.toBeTrueImplementation=function(){return{necessities:Object(s.a)({},i.toString(),Object(b.a)(i)),possibilities:{}}},i.evaluate=function(e){return e[i.elements[0].toString()]},i}return Object(d.a)(t,e),Object(c.a)(t,[{key:"getStateDelta",value:function(){return Object(s.a)({},this.elements[0].toString(),!0)}}]),t}(B),W=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,n,"Formula"))).evaluate=function(e){return i.elements[1].evaluate(e)},i.getVarName=function(){return i.elements[1].getVarName()},i.toStringFunction=function(){return"("+i.elements[1].toString()+")"},i}return Object(d.a)(t,e),Object(c.a)(t,[{key:"toBeFalseImplementation",value:function(){return this.elements[1].toBeFalse()}},{key:"toBeTrueImplementation",value:function(){return this.elements[1].toBeTrue()}},{key:"getStateDelta",value:function(){return this.elements[1].getStateDelta()}}]),t}(B),D=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,I,"Then"))).evaluate=function(e){return!i.elements[0].evaluate(e)||i.elements[2].evaluate(e)},i.toBeFalseImplementation=function(){var e={};e[i.elements[0].toString()]=i.elements[0];var t=C.wrapInNot(i.elements[2]);return e[t.toString()]=t,{necessities:e,possibilities:{}}},i.toBeTrueImplementation=function(){var e={},t=C.wrapInNot(i.elements[0]);return e[t.toString()]=t,e[i.elements[2].toString()]=i.elements[2],{necessities:{},possibilities:e}},i}return Object(d.a)(t,e),t}(B),_=function(e){function t(e,n,a){var i;return Object(l.a)(this,t),(i=Object(u.a)(this,Object(h.a)(t).call(this,e,I,"Iff"))).evaluate=function(e){return i.elements[0].evaluate(e)===i.elements[2].evaluate(e)},i.toBeFalseImplementation=function(){var e,t=F.wrapInAnd(C.wrapInNot(i.elements[0]),i.elements[2]),n=F.wrapInAnd(i.elements[0],C.wrapInNot(i.elements[2]));return{necessities:{},possibilities:(e={},Object(s.a)(e,t.toString(),t),Object(s.a)(e,n.toString(),n),e)}},i.toBeTrueImplementation=function(){var e,t=F.wrapInAnd(i.elements[0],i.elements[2]),n=F.wrapInAnd(C.wrapInNot(i.elements[0]),C.wrapInNot(i.elements[2]));return{necessities:{},possibilities:(e={},Object(s.a)(e,t.toString(),t),Object(s.a)(e,n.toString(),n),e)}},i}return Object(d.a)(t,e),t}(B),M=function e(t,n,a){var i=this;Object(l.a)(this,e),this.elements=t,this.syntaxmatch=n,this.classreffunction=a,this.getClassName=function(e){return i.classreffunction(e)}},Y=[new M(["VARIABLE"],I,function(e){return"Variable"}),new M(["UNARYOPERATOR",I],"UNARYOPERATOR",function(e){return e[0].className}),new M([I,"BINARYOPERATOR",I],"BINARYOPERATOR",function(e){return e[1].className}),new M(["OPENPARENS",I,"CLOSEPARENS"],I,function(e){return"Parenthetical"})],U={A:!0,B:!1},Q=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:U;Object(l.a)(this,e),this.sentence=t,this.formulae=void 0,this.foundAMatch=!1;var a=t.toUpperCase().replace(/\s/g,""),i=this.tokenizeSentence(a);console.log("Done, and tokens is ",i),console.log("-------------------"),this.formulae=this.parseTokensAndFormulae(i),console.log("this.formulae are ",this.formulae),console.log(">>>>>> this.formulae[0].evaluate() is ",this.formulae[0].evaluate(n))}return Object(c.a)(e,[{key:"getRoot",value:function(){if(this.formulae.length>1){var e="Couldn't parse sentence "+this.sentence;throw new Error(e)}return this.formulae[0]}},{key:"parseTokensAndFormulae",value:function(e){if(0===e.length)return[];var t=Object(x.a)(e);do{this.foundAMatch=!1;for(var n=0,a=Y;n<a.length;n++){var i=a[n];t=this.substitutePatternInSentence(i,t)}}while(this.foundAMatch&&t.length>1);return t}},{key:"substitutePatternInSentence",value:function(e,t){if(0===t.length)return[];for(var n,i=[],r=0;r<e.elements.length;r++){if(r>=t.length)return t;if(t[r].syntaxmatch!==e.elements[r])return[t[0]].concat(Object(x.a)(this.substitutePatternInSentence(e,t.slice(1))));n=e,i.push(t[r])}if(this.foundAMatch=!0,!n)return[];var o=n.getClassName(i),s=new a[o](i,n.syntaxmatch,o),l=t.slice(i.length);return[s].concat(Object(x.a)(this.substitutePatternInSentence(e,l)))}},{key:"tokenizeSentence",value:function(e){if(e.length<1)return[];var t,n;console.log("In tokenizeSentence, sentence is ",e);var a=!0,i=!1,r=void 0;try{for(var o,s=R[Symbol.iterator]();!(a=(o=s.next()).done);a=!0){var l=o.value,c="string"===typeof l.elements?l.elements:"#";if(0===e.indexOf(c))return t=new E(e.slice(0,l.elements.length),l.syntaxmatch,l.className),n=e.substring(l.elements.length),[t].concat(Object(x.a)(this.tokenizeSentence(n)))}}catch(u){i=!0,r=u}finally{try{a||null==s.return||s.return()}finally{if(i)throw r}}return t=new E(e.charAt(0),"VARIABLE",P),n=e.substring(1),[t].concat(Object(x.a)(this.tokenizeSentence(n)))}}]),e}(),q=function(e){function t(e){var n;Object(l.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).trueref=null,n.falseref=null,n.submitSentence=function(e){var t=n.state,a=t.sentence,i=t.stateValues;(0,n.props.evaluate)(a,i,!1),e.target.blur()},n.submitSentenceNegated=function(e){var t=n.state,a=t.sentence,i=t.stateValues;(0,n.props.evaluate)(a,i),e.target.blur()},n.onSentenceChange=function(e){n.setState({sentence:e.target.value})},n.onBooleansChange=function(e){return function(t){var a=n.state.stateValues,i=(e?n.trueref.value.split(""):n.falseref.value.split("")).reduce(function(t,n){return t[n]=e,t},{}),r=Object(p.a)({},a,i);n.setState({stateValues:r})}};var a=e.sentence,i=e.sentences,r=e.stateValues;return n.state={sentence:a,sentences:i,stateValues:r},n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){for(var e=this.state,t=e.sentence,n=e.sentences,a=e.stateValues,r=[],o=[],s=0,l=Object.keys(a);s<l.length;s++){var c=l[s];a[c]?r.push(c):o.push(c)}return i.createElement("div",{className:m.a.inputsection},i.createElement("div",{className:m.a.centered},i.createElement("select",{onChange:this.onSentenceChange,value:t},n.map(function(e){return i.createElement("option",{key:e,value:e},e)})),"The formula you want to test:",i.createElement("textarea",{cols:40,rows:10,onChange:this.onSentenceChange,value:t})),i.createElement("div",{className:m.a.buttons},i.createElement("button",{onClick:this.submitSentenceNegated},"Evaluate the Negation (to make tableau)"),i.createElement("button",{onClick:this.submitSentence},"Evaluate (for 2SAT)")))}}]),t}(i.Component),L=n(20);window.stringify=L;var z=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(n=Object(u.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(i)))).sentences=["(a||!b)&&(!a||b)&&(!a||!b)&&(a||!c)","((A<->B)||B||A)","((p->q)||(r->q))->((p||r)->q)","((A||B)->C)->((A->C)||(B->C))","((A->B)||(C->D))->((A->D)||(C->B))","(!(A->B))->(A)","((A && B) -> C )->( (A -> C) || (B -> C))","((p<->!!q)&&(!q->(r&&!s))&&(s->(p||q)))->((s&&q)->p)"],n.state={node:null,sentence:"((p->q)||(r->q))->((p||r)->q)",stateValues:{}},n.evaluate=function(e,t){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];window.scrollTo(0,0),n.setState({node:null},function(){var i=new Q(e,t).getRoot(),r=i;a&&(r=C.wrapInNot(i));var o=new T(Object(s.a)({},r.toString(),r),t,void 0,!1);o.updateStateAndGenerateChildren(),n.setState({sentence:e,stateValues:t,node:o})})},n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.state,t=e.sentence,n=e.stateValues,a=e.node;return i.createElement("div",{className:m.a.main},i.createElement(g,null,a&&i.createElement(k,{x:window.innerWidth/2,y:120,node:a,parent:null})),i.createElement(q,{sentences:this.sentences,evaluate:this.evaluate,stateValues:n,sentence:t}))}}]),t}(i.Component);n(24),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.render(i.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},8:function(e,t,n){e.exports={page:"App_page__1AVsN",inputsection:"App_inputsection__2bL89",centered:"App_centered__R4etd",buttons:"App_buttons__1l0RY",draggable:"App_draggable__1zP1X",nodecomponent:"App_nodecomponent__2hdcK",text:"App_text__372u0",children:"App_children__Q8Kyi"}}},[[14,1,2]]]);
//# sourceMappingURL=main.1f25e7cf.chunk.js.map