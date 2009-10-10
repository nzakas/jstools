/*
 * Copyright (c) 2008 - 2009 Nicholas C. Zakas. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Nicholas C. Zakas nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY NICHOLAS C. ZAKAS ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NICHOLAS C. ZAKAS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * FireUnit extension for YUI Test. Requires at least FireUnit 1.0a3.
 * @module yuitest-fireunit
 */
/**
 * Wraps functionality for integration with FireUnit.
 * @namespace YAHOO.tool
 * @class FireUnit
 * @static
 */
YAHOO.tool.FireUnit = function(){

    function handleEvent(event){
        switch(event.type){
            case "pass":
                fireunit.ok(true, event.testName + " passed.");
                break;
            case "fail":            
                if (event.error instanceof YAHOO.util.ComparisonFailure){
                    fireunit.ok(false, event.testName + "failed: " + event.error.message, event.error.expected, event.error.actual);
                } else {            
                    fireunit.ok(false, event.testName + "failed: " + event.error.message);
                }
                break;
            case "testsuitebegin":
                fireunit.group(event.testSuite.name);
                break;            
            case "testcasebegin":
                fireunit.group(event.testCase.name);
                break;                
            case "testsuitecomplete":
            case "testcasecomplete":
                fireunit.groupEnd();
                break;
            case "complete":
                fireunit.testDone();
                break;       
        }
    }

    return {
    
        /**
         * Attaches the FireUnit object to the YUI TestRunner.
         * @return {void}
         * @method attach
         * @static
         */
        attach: function(){
            var testRunner = YAHOO.tool.TestRunner;
            testRunner.subscribe("pass", handleEvent);
            testRunner.subscribe("fail", handleEvent);
            testRunner.subscribe("complete", handleEvent);
            testRunner.subscribe("testsuitebegin", handleEvent);
            testRunner.subscribe("testsuitecomplete", handleEvent);
            testRunner.subscribe("testcasebegin", handleEvent);
            testRunner.subscribe("testcasecomplete", handleEvent);
        },
        
        /**
         * Detaches the FireUnit object from the YUI TestRunner.
         * @return {void}
         * @method detach
         * @static
         */
        detach: function(){
            var testRunner = YAHOO.tool.TestRunner;
            testRunner.unsubscribe("pass", handleEvent);
            testRunner.unsubscribe("fail", handleEvent);
            testRunner.unsubscribe("complete", handleEvent);
            testRunner.unsubscribe("testsuitebegin", handleEvent);
            testRunner.unsubscribe("testsuitecomplete", handleEvent);
            testRunner.unsubscribe("testcasebegin", handleEvent);
            testRunner.unsubscribe("testcasecomplete", handleEvent);            
        }
    };

}();