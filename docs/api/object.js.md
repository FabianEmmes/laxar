
# object

Utilities for dealing with objects.

When requiring `laxar`, it is available as `laxar.object`.

## Contents

**Module Members**
- [extend](#extend)
- [options](#options)
- [forEach](#forEach)
- [path](#path)
- [setPath](#setPath)
- [deepClone](#deepClone)
- [deepFreeze](#deepFreeze)

## Module Members
#### <a name="extend"></a>extend( target, sources )
Copies the properties from a set of source objects over to the target object. Properties of sources
later in the arguments list overwrite existing properties in the target and earlier source objects.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| target | `Object` |  the target object to modify |
| sources... | `Object` |  the source objects to copy over |

##### Returns
| Type | Description |
| ---- | ----------- |
| `Object` |  the modified target object |

#### <a name="options"></a>options( obj, defaults )
Returns all properties from `obj` with missing properties completed from `defaults`. If `obj` is `null`
or `undefined`, an empty object is automatically created. `obj` and `defaults` are not modified by this
function. This is very useful for optional map arguments, resembling some kind of configuration.

Example:
```js
object.options( { validate: true }, {
   validate: false,
   highlight: true
} );
// =>
// {
//    validate: true,
//    highlight: true
// }
```

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| obj | `Object` |  the options object to use as source, may be `null` or `undefined` |
| defaults | `Object` |  the defaults to take missing properties from |

##### Returns
| Type | Description |
| ---- | ----------- |
| `Object` |  the completed options object |

#### <a name="forEach"></a>forEach( object, iteratorFunction )
Iterates over the keys of an object and calls the given iterator function for each entry. On each
iteration the iterator function is passed the `value`, the `key` and the complete `object` as
arguments. If `object` is an array, the native `Array.prototype.forEach` function is called and hence
the keys are the numeric indices of the array.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| object | `Object` |  the object to run the iterator function on |
| iteratorFunction | `Function` |  the iterator function to run on each key-value pair |

#### <a name="path"></a>path( obj, thePath, optionalDefault )
Finds a property in a nested object structure by a given path. A path is a string of keys, separated
by a dot from each other, used to traverse that object and find the value of interest. An additional
default is returned, if otherwise the value would yield `undefined`.

Example.
```js
object.path( { one: { two: 3 } }, 'one.two' ); // => 3
object.path( { one: { two: 3 } }, 'one.three' ); // => undefined
object.path( { one: { two: 3 } }, 'one.three', 42 ); // => 42

```

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| obj | `Object` |  the object to traverse |
| thePath | `String` |  the path to search for |
| _optionalDefault_ | `*` |  the value to return instead of `undefined` if nothing is found |

##### Returns
| Type | Description |
| ---- | ----------- |
| `*` |  the value at the given path |

#### <a name="setPath"></a>setPath( obj, path, value )
Sets a property in a nested object structure at a given path to a given value. A path is a string of
keys, separated by a dot from each other, used to traverse that object and find the place where the
value should be set. Any missing subtrees along the path are created.

Example:
```js
object.setPath( {}, 'name.first', 'Peter' ); // => { name: { first: 'Peter' } }
object.setPath( {}, 'pets.1', 'Hamster' ); // => { pets: [ null, 'Hamster' ] }
```

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| obj | `Object` |  the object to modify |
| path | `String` |  the path to set a value at |
| value | `*` |  the value to set at the given path |

##### Returns
| Type | Description |
| ---- | ----------- |
| `*` |  the full object (for chaining) |

#### <a name="deepClone"></a>deepClone( object )
Returns a deep clone of the given object. Note that the current implementation is intended to be used
for simple object literals only. There is no guarantee that cloning objects instantiated via
constructor function works and cyclic references will lead to endless recursion.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| object | `*` |  the object to clone |

##### Returns
| Type | Description |
| ---- | ----------- |
| `*` |  the clone |

#### <a name="deepFreeze"></a>deepFreeze( obj, optionalRecursive )
Freezes an object, optionally recursively, in any browser capable of freezing objects. In any other
browser this method simply returns its first value, i.e. is an identity operation.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| obj | `Object` |  the object to freeze |
| _optionalRecursive_ | `Boolean` |  freezes recursively if `true`. Default is `false` |

##### Returns
| Type | Description |
| ---- | ----------- |
| `Object` |  the input (possibly) frozen |
