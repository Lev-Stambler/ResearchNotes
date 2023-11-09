<style>

</style>

# Something with Quantum Circuits and Expectation of Post-Processing AC0

## Using Polynomial Factorization and Chinese Remainder Theorem

We can get non-trivial upper and lower bounds on the expectation of post-processing $\ACZ$ circuits by heavily relying on the two following papers

- [On Polynomial Approximations to $\ACZ$](https://arxiv.org/pdf/1604.08121.pdf)
  This paper will allow us to bound the output of the probabilistic polynomial to something **very** nice. Specifically,
  we get that for any $\mathbf{x} \in \binSet^n$ and $\ACZ$ circuit of size $s$ and degree $d$, $|f(\mathbf{x})| \leq (\log s)^{O(d)} \log(1 / \eps)$! Because we can square $f$ without experiencing too much pain, we will assume that
  \begin{equation}
  0 \leq f(x) \leq (\log s)^{O(d)} \log(1 / \eps).
  \end{equation}

- [Fast polynomial factorization and modular composition](http://users.cms.caltech.edu/~umans/papers/KU08-final.pdf)
  This is quite a fascinating paper IMO and something that cryptographers are hoping to use (though the parameters there do not quite work out). The key part that we will focus on is **Section 4** (Fast multivariate multipoint evaluation (in any characteristic). Specifically, we only care about the MULTIMODULAR algorithm (on the bottom of page 12 in the box)

Specifically, we have from the CRT (Chinese Remainder Theorem), given any $f(x)$ where $0 \leq f(x) \leq L$,

\begin{align*}
a_1 = f(x) \mod p_1 \\
a_2 = f(x) \mod p_2 \\
\;\;\vdots \\
a_k = f(x) \mod p_k \\
\end{align*}
where $p_1 \cdot p_2 \dots \cdot p_k \geq L$. Note that $k \in O(\log L)$.

Moreover, we can find fixed constants $\{M_i\}, \{K_i\}$ (TODO: please someone check me, from [Wikipedia](<https://en.wikipedia.org/wiki/Chinese_remainder_theorem#:~:text=In%20mathematics%2C%20the%20Chinese%20remainder,are%20pairwise%20coprime%20(no%20two)>)) such that

$$
f(x) = \sum_{i \in [k]} a_i M_i N_i.
$$

Now, this is cool beans.

Note that if we have the expectations for $a_i$ we can get the expectation for $f$!

-----------
## Aside: Fixing non {0, 1} outputs of a polynomial g

<!-- TODO: coefficient norm bound??? -->

Say that we have a polynomial $g$ that outputs values in $\Z/p\Z$. Note that
if $g \in \Z[X]$ but $g(x)$ is norm bounded by $L$, then we can assume that
$g \in \Z/p\Z$ even if the coefficients are not in $\Z/p\Z$.

<!-- TODO: check this above -->

We want to get a polynomial $g'$ that outputs values in $\{0, 1\}$ and that $g(x) = g'(x)$ if $g(x) \in \binSet$.
Seems easy enough right? Lets use a brute force technique to map all $g(x) > 1$ to $0$.

$$
g'(x) = \prod_{j \in \{0, \dots, p - 1\} \setminus \{1\}} (1 - j)^{-1} (g(x) - j).
$$

We can see that when $g(x) \neq 1$, we have $g'(x) = 0$. When $g(x) = 1$, then

$$
g'(x) = \prod_j (1 - j)^{-1} (1 - j) = 1.
$$

Another note is that this basically means that the total degree of $g'(x)$ is something like $(p - 1) \cdot \deg(g)$.

-----------
## Back to the main show. Using the above and the CRT

Note that if we want to use the above technique with $g'$ we will have a few issues.
First, we need to calculate expectations over a polynomial in $\Z/p\Z$. I believe though that this should be possible (see the appendix). We just need to calculate the probability of overflow. This should be fine maybe?

Second, and the larger problem, if our $p$ is $\text{poly}(\cdot)$ we are in trouble.
If we want our $\eps$ to be super-polynomially small, then we need to do some tricks.

### CRT and Unique Identification

We can note that CRT guarantees us that there is a unique $b_1, \dots, b_k$ such that

$$
\sum_{i \in [k]} b_i M_i N_i = 1.
$$

So, for every $p_i$ reduced polynomial, $f_i$, we create a polynomial
$f'_i$ such that $f'_i(x) = b_i$ if $f_i(x) = b_i$ and $f'_i(x) = 0$ otherwise.
Note that this increases the degree of $f_i$ by $O(p) = O(\log L)$.

### Lower Bounding the Expectation

So then, if we want to lower bound $\E[C(x)]$ where $x \sim \distrib$ and $C$ is an $\ACZ$ circuit, we simply need to find $\E[f'(x)]$ where $f'$ is the polynomial
that sends all outputs not equal to 1 to 0. We can see this as

$$
\E[f'(x)] = \Pr[f'(x) = 1] \leq \Pr[C(x) = 1] = \E[C(x)].
$$

Cool! So we can maybe find a lower bound. We can also use the same technique to upper bound the expectation by looking at the negation of $C$.

Okay so then,

\begin{align*}
\E[f'(x)] = \E\left[\sum_{i \in [k]} (f'_i(x) \text{ mod }p_i) M_i N_i\right] \\
= \sum_{i \in [k]} M_i N_i\E\left[(f'_i(x) \text{ mod }p_i) \right]. \\
\end{align*}

Now we need to find the expectation of $\E\left[(f'_i(x) \text{ mod }p_i) \right]$.
We will show how to do this in the next section.

<!-- TODO: -->

### Approximating the Expectation of a Modulo Reduced Polynomial
Let $g$ be a polynomial over finite field $\Z/p\Z$ with $T$ terms. We can express $g$ as

$$
g = \sum_{\ell \in T} c_\ell \text{Mon}(\ell)
$$

where $\text{Mon}$ is a monomial with coefficient 1 associated with the $\ell$ th term of $g$ and $c_\ell$ is the coefficient of the $\ell$ th term.

We abstract away the details of Mon and assume that we can estimate the expectation of the monomial and that $0 \leq \E[\text{Mon}(\ell)] \leq 1$ for all $\ell$.

$$
\E\left[(g(x) \text{ mod }p_i) \right] = \E\left[\sum_{\ell} c_\ell \text{Mon}(\ell) \text{ mod }p_i \right].
$$

For simplicity let $M_\ell$ be the random variable associated to $c_\ell \text{Mon}(\ell)$. Because of our restriction on $\text{Mon}$, we have that $0 \leq M_\ell < p$ and so $M_\ell = M_\ell \text{ mod } p$.

Cool! So we can find an explicit formula to calculate $\E[g(x)]$. Let $S = \sum_{\ell} M_\ell$. Then,

\begin{align*}
\E_{s \sim \distrib}[g(s)] = \sum_{s \in \distrib} \left(\sum_{\ell} M_\ell(s)\right) \mod p \cdot \Pr[s] \\
= \sum_{s \in \distrib, 0 \leq S < p} \left(\sum_{\ell} M_\ell(s)\right) \cdot \Pr[s] \\
+ \sum_{s \in \distrib,\; p \leq S < 2p} \left(\sum_{\ell} M_\ell(s) - p\right) \cdot \Pr[s] \\
... + \sum_{s \in \distrib,\; (\ell - 1)p \leq S < \ell p} \left(\sum_{\ell} M_\ell(s) - (\ell - 1)\right) \cdot \Pr[s] \\
= \sum_{s \in \distrib} \left(\sum_{\ell} M_\ell(s)\right) \cdot \Pr[s] - p \Pr[p \leq S < 2p] \\ - 2p \Pr[2p \leq S < 3p] \dots (\ell - 1)p \Pr[(\ell - 1)p \leq S].
\end{align*}

Noting that $\sum_{s \in \distrib} \left(\sum_{\ell} M_\ell(s)\right) \cdot \Pr[s] = \sum_{\ell} \E[M_\ell]$ and that we can approximate all the probabilities above by simply drawing from distribution $\distrib$ a enough time, we can approximate $\E[g(x)]$.

<!-- TODO: detail **exactly** how to do the mod thing -->

## Appendix-ish

### Chat GPT on Linearity of Expectation and Finite Fields

The concept of linearity of expectation is a fundamental principle in probability theory that holds true regardless of whether or not the random variables are independent. The principle states that for any two random variables \( X \) and \( Y \), the expectation of their sum is equal to the sum of their expectations:

$$ \mathbb{E}[X + Y] = \mathbb{E}[X] + \mathbb{E}[Y] $$

This principle can be extended to any finite number of random variables. For instance, if \( X_1, X_2, ..., X_n \) are random variables (not necessarily independent), then:

$$ \mathbb{E}\left[\sum_{i=1}^{n} X_i\right] = \sum\_{i=1}^{n} \mathbb{E}[X_i] $$

When you mention "for a field modulo 1," it seems like you might be talking about values being taken modulo 1, which essentially means you're looking at the fractional part of a number (since taking a number modulo 1 gives you the fractional component of that number). In a probabilistic context, if you're dealing with random variables \( X_i \) where you consider \( X_i \mod 1 \), then you're interested in the expectation of the fractional parts of these variables.

Even in such a scenario, linearity of expectation still holds. If \( X \) and \( Y \) are random variables, then the expectation of their sum modulo 1 is:

$$ \mathbb{E}[(X + Y) \mod 1] = \mathbb{E}[X \mod 1 + Y \mod 1 - \mathbb{I}\{X \mod 1 + Y \mod 1 \geq 1\}] $$

where \( \mathbb{I} \) is the indicator function which is 1 if \( X \mod 1 + Y \mod 1 \geq 1 \) and 0 otherwise. This equation accounts for the "wrap around" effect of the modulo operation.

However, the linearity of expectation principle directly would mean:

$$ \mathbb{E}[(X + Y) \mod 1] = \mathbb{E}[X \mod 1] + \mathbb{E}[Y \mod 1] - \mathbb{E}[\mathbb{I}\{X \mod 1 + Y \mod 1 \geq 1\}] $$

In the above equation, the expectations on the right-hand side might not necessarily be straightforward to calculate due to the indicator function. However, the linearity itself does not guarantee that the expected value of the modulo operation is the modulo of the expected values; these are not equivalent because the modulo operation is not a linear transformation.

Therefore, while linearity of expectation holds in general, applying it within the context of modular arithmetic requires careful consideration of the wraparound effect that the modulo operation introduces. When you calculate expectations modulo 1, you must consider the fact that the operation may transform the distribution of your random variables in a nonlinear way, especially around the wraparound point.
