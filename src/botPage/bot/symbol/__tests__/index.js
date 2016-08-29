'use strict';
import _Symbol from '../index';
import tools from 'binary-common-utils/tools';
import {expect} from 'chai';
import ws from 'mock/websocket';
import CustomApi from 'binary-common-utils/customApi';

describe('symbol', function() {
	describe('Error Handling', function(){
		it('initializing is needed for symbol functions', function(){
			expect(function(){_Symbol.getAllowedConditions();}).to.throw(Error);
			expect(function(){_Symbol.isConditionAllowedInSymbol();}).to.throw(Error);
			expect(function(){_Symbol.getConditionName();}).to.throw(Error);
			expect(function(){_Symbol.getCategoryForCondition();}).to.throw(Error);
			expect(function(){_Symbol.getCategoryNameForCondition();}).to.throw(Error);
			expect(function(){_Symbol.getAllowedCategoryNames();}).to.throw(Error);
			expect(function(){_Symbol.findSymbol();}).to.throw(Error);
		});
	});
	describe('Checking functions', function(){
		
		var symbol;
		before(function(done){
			symbol = new _Symbol(new CustomApi(ws));
			symbol.initPromise.then(function(){
				done();
			});
		});
		it('findSymbol returns symbol if exist', function(){
			expect(symbol.findSymbol('R_100')).to.be.ok
				.and.to.have.property('R_100');
			expect(symbol.findSymbol('FAKE')).not.to.be.ok;
		});
		it('getAllowedCategoryNames returns allowed category names', function(){
			expect(symbol.getAllowedCategoryNames('R_100')).to.be.ok
				.and.to.have.all.members([ 'Up/Down', 'Digits', 'Asians', 'Touch/No Touch', 'Ends In/Out', 'Stays In/Goes Out' ]);
			expect(symbol.getAllowedCategoryNames('FAKE')).to.be.empty;
		});
		it('getCategoryNameForCondition returns category name of a condition', function(){
			expect(symbol.getCategoryNameForCondition('risefall'))
				.to.be.equal('Up/Down');
		});
		it('getCategoryForCondition returns category of a condition', function(){
			expect(symbol.getCategoryForCondition('risefall'))
				.to.be.equal('callput');
		});
		it('getConditionName returns name of a condition', function(){
			expect(symbol.getConditionName('risefall'))
				.to.be.equal('Rise/Fall');
		});
		it('isConditionAllowedInSymbol returns true if a condition is allowed in a symbol', function(){
			expect(symbol.isConditionAllowedInSymbol('R_100', 'risefall'))
				.to.be.ok;
			expect(symbol.isConditionAllowedInSymbol('frxEURUSD', 'asians'))
				.not.to.be.ok;
			expect(symbol.isConditionAllowedInSymbol('fake', 'asians'))
				.not.to.be.ok;
			expect(symbol.isConditionAllowedInSymbol('frxEURUSD', 'fake'))
				.not.to.be.ok;
		});
		it('getAllowedConditionsForSymbol returns allowed conditions for a symbol', function(){
			expect(symbol.getAllowedConditionsForSymbol('R_100'))
				.to.have.all.members([ 'risefall', 'higherlower', 'matchesdiffers', 'evenodd', 'overunder', 'asians', 'touchnotouch', 'endsinout', 'staysinout' ]);
			expect(symbol.getAllowedConditionsForSymbol('fake'))
				.to.be.empty;
		});
		it('getAllowedCategoriesForSymbol returns allowed categories for a symbol', function(){
			expect(symbol.getAllowedCategoriesForSymbol('R_100'))
				.to.have.all.members([ 'callput', 'digits', 'asian', 'touchnotouch', 'endsinout', 'staysinout' ]);
			expect(symbol.getAllowedCategoriesForSymbol('fake'))
				.to.be.empty;
		});
	});
	after(function(){
		delete _Symbol.instance;
	});
});