# Warning

Development of plugin is still WIP. Feel free to contribute!

# Usage

Add template-processor to plugins list, chose your config and add it to `extends` property:

```diff
   extends: [
+    'plugin:template-processor/recommended'
   ],
   plugins: [
+    'template-processor',
   ],
```

# Known issues

* Incompatibility with `prettier`
* Incorrect behaviour with `vue/comment-directive` rule

Due to misbehavior of these rules, currently they are disabled and will be skipped
