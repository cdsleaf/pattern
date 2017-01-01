/**
 * Created by cho on 2017-01-01.
 */

describe('DiContainer', ()=>{
    var container;
    beforeEach(()=>{
        container = new DiContainer();
    });

    describe('register(name, dependencies, func)', ()=>{
        it('인자가 하나라도 빠졌거나 타입이 잘못되면 예외를 던진다.', ()=>{
            var badArgs=[
                [],
                ['name'],
                ['name', ['Dependency1', 'Dependency2']],
                ['name', ()=>{}],
                [1, ['a', 'b'], ()=>{}],
                ['name', [1, 2], ()=>{}],
                ['name', ['a', 'b'], 'should be a function']
            ];
            badArgs.forEach((args)=>{
                expect(()=>{
                    container.register.apply(container,args);
                }).toThrow();
            });
        });
    });

    describe('get(name)', ()=>{
        it('성명이 등록되어 있지 않으면 undefined를 반환한다.', ()=>{
            expect(container.get('notDefined')).toBeUndefined();
        });

        it('등록된 함수에 의존성을 제공한다.', ()=>{
            let main = 'main', mainFunc, dep1 = 'dep1', dep2 = 'dep2';

            container.register(main, [dep1, dep2], (dep1Func, dep2Func)=>{
                return ()=>{
                    return dep1Func() + dep2Func();
                }
            });

            container.register(dep1, [], ()=>{
                return ()=>{
                    return 1;
                };
            });

            container.register(dep2, [], ()=>{
                return ()=>{
                    return 2;
                };
            });

            mainFunc = container.get(main);
            expect(mainFunc()).toBe(3);
        });
    });

    it('등록된 함수를 실행한 결과를 반환한다.', ()=>{
        var name = 'MyName', returnFromRegisteredFunction = "something";
        container.register(name, [], ()=>{
            return returnFromRegisteredFunction;
        });
        expect(container.get(name)).toBe(returnFromRegisteredFunction);
    });

    it('의존성을 재귀적으로 제공한다', function() {
        let level1 = 'one',
            level2 = 'two',
            level3 = 'three',
            result = [];
        container.register(level1,[level2], function(level2func) {
            return function() {
                result.push(level1);
                level2func();
            };
        });
        container.register(level2,[level3], function(level3func) {
            return function() {
                result.push(level2);
                level3func();
            };
        });
        container.register(level3,[], function() {
            return function() {
                result.push(level3);
            };
        });

        container.get(level1)();
        expect(result).toEqual([level1,level2,level3]);
    });
});