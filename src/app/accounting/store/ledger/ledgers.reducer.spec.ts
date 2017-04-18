/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {reducer, State} from './ledgers.reducer';
import {
  CreateLedgerSuccessAction, CreateSubLedgerPayload, CreateSubLedgerSuccessAction, LedgerRoutePayload,
  LoadAllTopLevelComplete, UpdateLedgerSuccessAction
} from './ledger.actions';
import {Ledger} from '../../../../services/accounting/domain/ledger.model';

describe('Ledgers Reducer', () => {

  function createLedger(value: string): Ledger{
    return { identifier: value, name: value, type: 'ASSET', subLedgers: []};
  }

  describe('LOAD_ALL_TOP_LEVEL_COMPLETE', () => {

    it('should add all ledgers if not in store', () => {
      let ledgerOne = createLedger('test1');
      let ledgerTwo = createLedger('test2');

      let payload: Ledger[] = [
        ledgerOne,
        ledgerTwo
      ];

      let expectedResult: State = {
        ids: [ledgerOne.identifier, ledgerTwo.identifier],
        topLevelIds: [ledgerOne.identifier, ledgerTwo.identifier],
        entities: {
          'test1': ledgerOne,
          'test2': ledgerTwo
        },
        loadedAt: {
          'test1': Date.now(),
          'test2': Date.now()
        },
        selectedLedgerId: null,
      };

      let result = reducer(undefined, new LoadAllTopLevelComplete(payload));

      expect(result).toEqual(expectedResult);
    })
  });

  describe('CREATE_SUCCESS', () => {
    it('should add ledger to top level ids if not in store', () => {
      let ledgerOne = createLedger('test1');

      let payload: LedgerRoutePayload = {
        ledger: ledgerOne,
        activatedRoute: null
      };

      let expectedResult: State = {
        ids: [ledgerOne.identifier],
        topLevelIds: [ledgerOne.identifier],
        entities: {
          'test1': ledgerOne
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      let result = reducer(undefined, new CreateLedgerSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    })
  });

  describe('CREATE_SUB_LEDGER_SUCCESS', () => {
    it('should add ledger not to top level ids', () => {
      let parentLedger = createLedger('parent');
      let ledgerOne = createLedger('test1');

      let initialState: State = {
        ids: [parentLedger.identifier],
        topLevelIds: [parentLedger.identifier],
        entities: {
          'parent': parentLedger
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      let payload: CreateSubLedgerPayload = {
        parentLedgerId: parentLedger.identifier,
        ledger: ledgerOne,
        activatedRoute: null
      };

      let expectedResult: State = {
        ids: [parentLedger.identifier, ledgerOne.identifier],
        topLevelIds: [parentLedger.identifier],
        entities: {
          'test1': ledgerOne,
          'parent': Object.assign({}, parentLedger, {
            subLedgers: [ledgerOne]
          })
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      let result = reducer(initialState, new CreateSubLedgerSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    })
  });

  describe('UPDATE_SUCCESS', () => {
    it('should update the new ledger in entities', () => {
      let ledgerOne = createLedger('test1');

      let updatedLedger = Object.assign({}, ledgerOne, {
        name: 'newName'
      });

      let payload: LedgerRoutePayload = {
        ledger: updatedLedger,
        activatedRoute: null
      };

      let initialState: State = {
        ids: [ledgerOne.identifier],
        topLevelIds: [],
        entities: {
          'test1': ledgerOne
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      let expectedResult: State = {
        ids: [ledgerOne.identifier],
        topLevelIds: [],
        entities: {
          'test1': updatedLedger
        },
        loadedAt: {},
        selectedLedgerId: null,
      };

      let result = reducer(initialState, new UpdateLedgerSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    })
  });
});